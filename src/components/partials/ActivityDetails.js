// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DayJS from "react-dayjs";
import { Typeahead } from "react-bootstrap-typeahead";
import { toastr } from "react-redux-toastr";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

// Geonorge WebComponents
/* eslint-disable */
import {
    GnButton,
    GnDialog,
    GnFieldContainer,
    GnLabel,
    GnInput,
    HeadingText
} from "@kartverket/geonorge-web-components/GnTable";
/* eslint-enable */

// Components
import { translate } from "actions/ConfigActions";
import ValidationErrors from "components/partials/ValidationErrors";

// Models
import { Activity } from "models/activity";

// Actions
import { createActivity, updateActivity, deleteActivity } from "actions/ActivityActions";
import { fetchOrganizations } from "actions/OrganizationsActions";
import { fetchOptions } from "actions/OptionsActions";

// Helpers
import { canDeleteActivity, canEditActivity } from "helpers/authorizationHelpers";
import { formatInputDateValue } from "helpers/formatHelpers";

// Stylesheets
import formsStyle from "components/partials/forms.module.scss";

const ActivityDetails = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux store
    const selectedMeasure = useSelector((state) => state.measures.selectedMeasure);
    const authInfo = useSelector((state) => state.authInfo);
    const selectedActivity = useSelector((state) => state.activities.selectedActivity);
    const user = useSelector((state) => state.oidc.user);
    const planStatuses = useSelector((state) => state.options.planStatuses);
    const organizations = useSelector((state) =>
        state.organizations.map((organization) => {
            return {
                organizationId: organization.id,
                name: organization.name
            };
        })
    );

    // State
    const [activity, setActivity] = useState(
        props.newActivity ? new Activity({ measureId: selectedMeasure?.id }) : selectedActivity
    );
    const [activityDescriptionMarkdown, setActivityDescriptionMarkdown] = useState(activity?.description || "");
    const [editable, setEditable] = useState(props.location?.state?.editable || props.newActivity ? true : false);
    const [dataFetched, setDataFetched] = useState(false);
    const [dialogOpen, setDialogOpen] = useState([false]);
    const [validationErrors, setValidationErrors] = useState(false);

    // Params
    const { measureNumber } = useParams();

    useEffect(() => {
        Promise.all([dispatch(fetchOrganizations()), dispatch(fetchOptions())]).then(() => {
            setDataFetched(true);
        });
    }, [dispatch]);

    const handleChange = (data) => {
        const { name, value, type } = data.target ? data.target : data;
        let newValue = value;

        if (type !== "date") {
            const parsed = parseInt(value);
            newValue = isNaN(parsed) ? value : parsed;
        }
        activity[name] = newValue;
        setActivity(activity);
    };

    const handleParticipantsChange = (participants) => {
        if (!participants.length) {
            return;
        }

        participants.forEach((participant) => {
            if (participant.customOption) {
                delete participant.id;
                delete participant.customOption;
            }
            participant.activityId = activity.id;
        });

        handleChange({
            name: "participants",
            value: participants
        });
    };

    const getActivityStatusLabel = (planStatuses, activity) => {
        let allStatus = { value: 0, label: "Alle" };
        if (!statusExists(0, planStatuses)) planStatuses.unshift(allStatus);

        return planStatuses && activity.status && planStatuses[activity.status] && planStatuses[activity.status].label
            ? planStatuses[activity.status].label
            : "";
    };

    const statusExists = (status, arr) => {
        return arr.some(function (el) {
            return el.value === status;
        });
    };

    const handleDelete = () => {
        dispatch(
            deleteActivity(activity, user).then(() => {
                navigate(`/tiltak/${measureNumber}`);
            })
        );
    };

    const saveActivity = () => {
        props.newActivity ? createNewActivity() : updateCurrentActivity();
    };

    const createNewActivity = () => {
        dispatch(createActivity(activity, user))
            .then(() => {
                setValidationErrors([]);
                navigate(`/tiltak/${measureNumber}`);
            })
            .catch(({ response }) => {
                toastr.error("Kunne ikke opprette aktivitet");
                setValidationErrors(response.data);
                window.scroll(0, 0);
            });
    };

    const updateCurrentActivity = () => {
        dispatch(updateActivity(activity, user))
            .then((_) => {
                setValidationErrors([]);
                toastr.success("Aktiviteten ble oppdatert");
            })
            .catch(({ response }) => {
                toastr.error("Kunne ikke oppdatere aktivitet");
                setValidationErrors(response.data);
                window.scroll(0, 0);
            });
    };

    const getParticipants = () => {
        if (activity?.participants?.length) {
            return activity.participants.map((participant, index) => (
                <div key={`participant-${index}`}>{participant.name}</div>
            ));
        }
        return "";
    };

    if (!dataFetched) {
        return "";
    }

    const openDialog = () => {
        setDialogOpen(false);
        setTimeout(() => {
            setDialogOpen(true);
        });
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    return activity ? (
        <React.Fragment>
            <ValidationErrors errors={validationErrors} />

            <gn-field-container block>
                <gn-label block>
                    <label htmlFor="activity-no">{dispatch(translate("labelNumber"))}</label>
                </gn-label>
                {editable ? (
                    <gn-input>
                        <input
                            id="activity-no"
                            name="no"
                            defaultValue={activity.no}
                            type="number"
                            min="0"
                            onChange={handleChange}
                        />
                    </gn-input>
                ) : (
                    <div>{activity.no}</div>
                )}
            </gn-field-container>

            <gn-field-container block>
                <gn-label block>
                    <label htmlFor="activity-name">{dispatch(translate("Activity"))}</label>
                </gn-label>
                {editable ? (
                    <gn-input block fullWidth>
                        <input id="activity-name" name="name" defaultValue={activity.name} onChange={handleChange} />
                    </gn-input>
                ) : (
                    <div>{activity.name}</div>
                )}
            </gn-field-container>

            <gn-field-container block>
                <gn-label block>
                    <label htmlFor="activity-description">{dispatch(translate("Description"))}</label>
                </gn-label>
                <div data-color-mode="light">
                    {editable ? (
                        <MDEditor
                            id="activity-description"
                            preview="edit"
                            height={200}
                            name="description"
                            value={activityDescriptionMarkdown || ""}
                            onChange={(value) => {
                                handleChange({ name: "description", value });
                                setActivityDescriptionMarkdown(value);
                            }}
                        />
                    ) : (
                        <MDEditor.Markdown id="activity-description" source={activityDescriptionMarkdown || ""} />
                    )}
                </div>
            </gn-field-container>

            <gn-field-container block>
                <gn-label block>
                    <label htmlFor="activity-implementationStart">Start</label>
                </gn-label>
                {editable ? (
                    <gn-input>
                        <input
                            id="activity-implementationStart"
                            name="implementationStart"
                            defaultValue={
                                activity.implementationStart?.length
                                    ? formatInputDateValue(activity.implementationStart)
                                    : ""
                            }
                            type="date"
                            onChange={(event) =>
                                handleChange({ name: "implementationStart", value: event.target.value, type: "date" })
                            }
                        />
                    </gn-input>
                ) : (
                    <DayJS format="MMMM YYYY" locale="nb">
                        {activity.implementationStart}
                    </DayJS>
                )}
            </gn-field-container>

            <gn-field-container block>
                <gn-label block>
                    <label htmlFor="activity-implementationEnd">{dispatch(translate("End"))}</label>
                </gn-label>
                {editable ? (
                    <gn-input>
                        <input
                            id="activity-implementationEnd"
                            name="implementationEnd"
                            defaultValue={
                                activity.implementationEnd?.length
                                    ? formatInputDateValue(activity.implementationEnd)
                                    : ""
                            }
                            type="date"
                            onChange={(event) =>
                                handleChange({ name: "implementationEnd", value: event.target.value, type: "date" })
                            }
                        />
                    </gn-input>
                ) : (
                    <DayJS format="MMMM YYYY" locale="nb">
                        {activity.implementationEnd}
                    </DayJS>
                )}
            </gn-field-container>

            <gn-field-container block>
                <gn-label block>
                    <label htmlFor="activity-status">Status</label>
                </gn-label>
                {editable ? (
                    <gn-select>
                        <select name="status" defaultValue={activity.status || 1} onChange={handleChange}>
                            {planStatuses.map((planStatus) => {
                                return (
                                    <option key={planStatus.value} value={planStatus.value}>
                                        {planStatus.label}
                                    </option>
                                );
                            })}
                        </select>
                    </gn-select>
                ) : (
                    <span id="activity-status">{getActivityStatusLabel(planStatuses, activity)}</span>
                )}
            </gn-field-container>

            <gn-field-container block>
                <gn-label block>
                    <label htmlFor="activity-participants">{dispatch(translate("Participants"))}</label>
                </gn-label>
                {editable ? (
                    <gn-input block fullwidth>
                        <Typeahead
                            allowNew
                            multiple
                            id="activity-participants"
                            labelKey="name"
                            onChange={handleParticipantsChange}
                            options={organizations}
                            defaultSelected={activity.participants}
                            placeholder="Legg til deltakere..."
                            newSelectionPrefix="Legg til "
                        />
                    </gn-input>
                ) : (
                    <div>{getParticipants()}</div>
                )}
            </gn-field-container>

            <div className={formsStyle.btngroup}>
                {editable ? (
                    props.newActivity ? (
                        <div>
                            <gn-button color="default">
                                <Link to={`/tiltak/${measureNumber}/`}>Avbryt oppretting</Link>
                            </gn-button>
                            <gn-button color="primary">
                                <button onClick={saveActivity}>Opprett</button>
                            </gn-button>
                        </div>
                    ) : (
                        <div>
                            <gn-button color="default">
                                <button onClick={() => setEditable(false)}>Avslutt redigering</button>
                            </gn-button>
                            <gn-button color="primary">
                                <button onClick={saveActivity}>Lagre</button>
                            </gn-button>
                        </div>
                    )
                ) : (
                    <div>
                        {canDeleteActivity(authInfo, selectedActivity.responsibleAgency) ? (
                            <gn-button color="default">
                                <button onClick={() => openDialog()}>Slett aktivitet</button>
                            </gn-button>
                        ) : null}
                        {canEditActivity(authInfo, selectedActivity.responsibleAgency) ? (
                            <gn-button color="primary">
                                <button onClick={() => setEditable(true)}>Rediger aktivitet</button>
                            </gn-button>
                        ) : null}
                    </div>
                )}
            </div>
            <gn-dialog show={dialogOpen}>
                <heading-text>
                    <h2>Slett aktivitet</h2>
                </heading-text>
                <p>Er du sikker på at du vil slette {activity.name}?</p>
                <gn-button color="default">
                    <button onClick={() => closeDialog()}>{dispatch(translate("btnCancel"))} </button>
                </gn-button>
                <gn-button color="danger">
                    <button onClick={handleDelete}>{dispatch(translate("btnDelete"))} </button>
                </gn-button>
            </gn-dialog>
        </React.Fragment>
    ) : null;
};

export default ActivityDetails;
