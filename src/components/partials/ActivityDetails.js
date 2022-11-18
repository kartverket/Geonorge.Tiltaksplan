// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import SimpleMDE from "react-simplemde-editor";
import { registerLocale } from "react-datepicker";
import nb from "date-fns/locale/nb";
import DayJS from "react-dayjs";
import { Typeahead } from "react-bootstrap-typeahead";
import { toastr } from "react-redux-toastr";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";

// Components
import { SelectDropdown } from "components/custom-elements";
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

// Stylesheets
import formsStyle from "components/partials/forms.module.scss";

const editableMdeOptions = {
    toolbar: ["bold", "italic", "link", "unordered-list", "|", "preview"],
    spellChecker: false
};

const readOnlyMdeOptions = {
    toolbar: false,
    status: false,
    spellChecker: false,
    readOnly: true
};

registerLocale("nb", nb);

const ActivityDetails = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux store
    const selectedMeasure = useSelector((state) => state.options.selectedMeasure);
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
    const authInfo = useSelector((state) => state.authInfo);
    const selectedActivity = useSelector((state) => state.activities.selectedActivity);

    // Params
    const { measureNumber } = useParams();

    const [activity, setActivity] = useState(
        props.newActivity ? new Activity({ measureId: selectedMeasure?.id }) : selectedActivity
    );
    const [editable, setEditable] = useState(props.location?.state?.editable || props.newActivity ? true : false);
    const [dataFetched, setDataFetched] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState(false);

    useEffect(() => {
        Promise.all([dispatch(fetchOrganizations()), dispatch(fetchOptions())]).then(() => {
            setDataFetched(true);
        });
    }, [dispatch]);

    const handleChange = (data) => {
        const { name, value } = data.target ? data.target : data;
        let newValue;

        if (value instanceof Date) {
            newValue = formatDate(value);
        } else {
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

    const formatDate = (date) => {
        const diff = 120; // max diff norway
        var newDateObj = new Date(date.getTime() + diff * 60000);
        return newDateObj;
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
        dispatch(
            createActivity(activity, user).then((_) => {
                setValidationErrors([]);
                navigate(`/tiltak/${measureNumber}`);
            })
        ).catch(({ response }) => {
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

    const getMdeInstance = (instance) => {
        const container = instance?.element?.nextSibling;
        container.setAttribute("tabIndex", "0");

        if (!editable) {
            const editableElement = container.getElementsByClassName("CodeMirror-scroll")?.[0];
            editableElement.style.display = "none";
            instance.togglePreview();
            instance.codemirror.options.readOnly = true;
            container.classList.add(formsStyle.mdePreview);
        }
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

    return activity ? (
        <React.Fragment>
            <ValidationErrors errors={validationErrors} />

            <Form.Group controlId="formName" className={formsStyle.form}>
                <Form.Label>{dispatch(translate("labelNumber"))}</Form.Label>
                {editable ? (
                    <div className={formsStyle.comboInput}>
                        <Form.Control type="number" min="0" name="no" value={activity.no} onChange={handleChange} />
                    </div>
                ) : (
                    <div>{activity.no}</div>
                )}
            </Form.Group>
            <Form.Group controlId="formName" className={formsStyle.form}>
                <Form.Label>{dispatch(translate("Activity"))} </Form.Label>
                {editable ? (
                    <div className={formsStyle.comboInput}>
                        <Form.Control type="text" name="name" value={activity.name} onChange={handleChange} />
                    </div>
                ) : (
                    <div>{activity.name}</div>
                )}
            </Form.Group>

            <Form.Group controlId="formName" className={formsStyle.form}>
                <Form.Label>{dispatch(translate("Description"))} </Form.Label>
                {editable ? (
                    <div className={formsStyle.comboInput} style={{ display: "block" }}>
                        <SimpleMDE
                            value={activity?.description || ""}
                            onChange={(value) => handleChange({ name: "description", value })}
                            options={editableMdeOptions}
                            getMdeInstance={getMdeInstance}
                        />
                    </div>
                ) : (
                    <SimpleMDE
                        value={activity?.description || ""}
                        options={readOnlyMdeOptions}
                        getMdeInstance={getMdeInstance}
                    />
                )}
            </Form.Group>

            <Form.Group controlId="formName" className={formsStyle.form}>
                <Form.Label>Start </Form.Label>

                {editable ? (
                    <div className={formsStyle.comboInput}>
                        <DatePicker
                            dateFormat="dd.MM.yyyy"
                            locale="nb"
                            name="implementationStart"
                            placeholderText="Sett startdato"
                            selected={activity.implementationStart ? new Date(activity.implementationStart) : null}
                            onChange={(date) => handleChange({ name: "implementationStart", value: date })}
                        />
                    </div>
                ) : (
                    <div>
                        <DayJS format="MMMM YYYY">{activity.implementationStart}</DayJS>
                    </div>
                )}
            </Form.Group>

            <Form.Group controlId="formName" className={formsStyle.form}>
                <Form.Label>{dispatch(translate("End"))} </Form.Label>
                {editable ? (
                    <div className={formsStyle.comboInput}>
                        <DatePicker
                            dateFormat="dd.MM.yyyy"
                            locale="nb"
                            name="implementationEnd"
                            placeholderText="Sett sluttdato"
                            selected={activity.implementationEnd ? new Date(activity.implementationEnd) : null}
                            onChange={(date) => handleChange({ name: "implementationEnd", value: date })}
                        />
                    </div>
                ) : (
                    <div>
                        <DayJS format="MMMM YYYY" locale="nb">
                            {activity.implementationEnd}
                        </DayJS>
                    </div>
                )}
            </Form.Group>
            <Form.Group controlId="formName" className={formsStyle.form}>
                <Form.Label>Status </Form.Label>
                {editable ? (
                    <div className={formsStyle.comboInput}>
                        <SelectDropdown
                            name="status"
                            value={activity.status || 1}
                            options={planStatuses}
                            onSelect={handleChange}
                            className={formsStyle.statusSelect}
                        />
                    </div>
                ) : (
                    <span>{getActivityStatusLabel(planStatuses, activity)}</span>
                )}
            </Form.Group>
            <Form.Group controlId="formName" className={formsStyle.form}>
                <Form.Label>{dispatch(translate("Participants"))} </Form.Label>
                {editable ? (
                    <Typeahead
                        allowNew
                        multiple
                        id="basic-typeahead-multiple"
                        labelKey="name"
                        onChange={handleParticipantsChange}
                        options={organizations}
                        selected={activity.participants}
                        placeholder="Legg til deltakere..."
                        newSelectionPrefix="Legg til "
                    />
                ) : (
                    <div>{getParticipants()}</div>
                )}
            </Form.Group>
            <div className={formsStyle.btngroup}>
                {editable ? (
                    <div>
                        {props.newActivity ? (
                            <React.Fragment>
                                <Button
                                    className="mr-2"
                                    variant="secondary"
                                    onClick={() => navigate(`/tiltak/${selectedMeasure.no}/`)}
                                >
                                    Avbryt oppretting
                                </Button>
                                <Button variant="primary" onClick={saveActivity}>
                                    Opprett
                                </Button>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Button className="mr-2" variant="secondary" onClick={() => setEditable(false)}>
                                    Avslutt redigering
                                </Button>
                                <Button variant="primary" onClick={saveActivity}>
                                    Lagre
                                </Button>
                            </React.Fragment>
                        )}
                    </div>
                ) : (
                    <div>
                        {canDeleteActivity(authInfo, selectedActivity.responsibleAgency) ? (
                            <Button className="mr-2" variant="secondary" onClick={() => setModalOpen(true)}>
                                Slett aktivitet
                            </Button>
                        ) : (
                            ""
                        )}
                        {canEditActivity(authInfo, selectedActivity.responsibleAgency) ? (
                            <Button variant="primary" onClick={() => setEditable(true)}>
                                Rediger aktivitet
                            </Button>
                        ) : (
                            ""
                        )}
                    </div>
                )}
            </div>
            {
                <Modal
                    show={modalOpen}
                    onHide={() => setModalOpen(false)}
                    keyboard={false}
                    animation={false}
                    centered
                    backdrop="static"
                    aria-labelledby="form-dialog-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Slett aktivitet</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Er du sikker på at du vil slette {activity.name}?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            {dispatch(translate("btnCancel"))}{" "}
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            {dispatch(translate("btnDelete"))}{" "}
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </React.Fragment>
    ) : null;
};

export default ActivityDetails;
