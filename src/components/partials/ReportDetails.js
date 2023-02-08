// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastr } from "react-redux-toastr";
import MDEditor from "@uiw/react-md-editor";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { fetchOrganizations } from "actions/OrganizationsActions";

import ValidationErrors from "components/partials/ValidationErrors";
import ToggleHelpText from "components/template/ToggleHelpText";

// Actions
import { fetchOptions } from "actions/OptionsActions";
import { translate } from "actions/ConfigActions";
import { deleteMeasure, updateMeasure } from "actions/MeasuresActions";

// Helpers
import { canEditReport } from "helpers/authorizationHelpers";

// Assets
import StarIcon from "gfx/icon-star.svg";

// Stylesheets
import formsStyle from "components/partials/forms.module.scss";

const ReportDetails = (props) => {
    const dispatch = useDispatch();

    //Redux store
    const user = useSelector((state) => state.oidc.user);
    const selectedMeasure = useSelector((state) => state.measures.selectedMeasure);
    const measureVolume = useSelector((state) => state.options.measureVolume);
    const measureResults = useSelector((state) => state.options.measureResults);
    const trafficLights = useSelector((state) => state.options.trafficLights);
    const planStatuses = useSelector((state) => state.options.planStatuses);
    const authInfo = useSelector((state) => state.authInfo);

    //Params
    const [dataFetched, setDataFetched] = useState(false);
    const [editableReport, setEditableReport] = useState(false);
    const [validationErrors, setValidationErrors] = useState(false);
    const [measure, setMeasure] = useState(selectedMeasure);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        Promise.all([dispatch(fetchOrganizations()), dispatch(fetchOptions())]).then(() => {
            setDataFetched(true);
        });
    }, [dispatch]);

    const handleChange = (data) => {
        const { name, value } = data.target ? data.target : data;
        let newValue;

        if (value instanceof Date) {
            newValue = value.toISOString();
        } else {
            const parsed = parseInt(value);
            newValue = isNaN(parsed) ? value : parsed;
        }

        measure[name] = newValue;

        setMeasure(measure);
    };
    const handleDelete = () => {
        dispatch(deleteMeasure(measure, user));
    };

    const saveMeasure = () => {
        dispatch(updateMeasure(measure, user))
            .then(() => {
                toastr.success("Tiltaket ble oppdatert");
                setValidationErrors(validationErrors);
            })
            .catch(({ response }) => {
                toastr.error("Kunne ikke oppdatere tiltak");
                setValidationErrors(response.data);
            });
    };

    const getMeasureStatusLabel = (planStatuses, measure) => {
        return planStatuses.find((status) => measure.status === status.value).label;
    };

    const getMdeInstance = (instance) => {
        const container = instance?.element?.nextSibling;
        container.setAttribute("tabIndex", "0");
        if (!editableReport) {
            const editableElement = container.getElementsByClassName("CodeMirror-scroll")?.[0];
            editableElement.style.display = "none";
            instance.togglePreview();
            instance.codemirror.options.readOnly = true;
            container.classList.add(formsStyle.mdePreview);
        }
    };

    const renderStars = (amount) => {
        return [...Array(amount).keys()].map((nr) => (
            <img key={`star-${nr}`} className={formsStyle.star} src={StarIcon} alt="Stjerne" />
        ));
    };

    if (!dataFetched) {
        return "";
    }

    return (
        <React.Fragment>
            <div className={`${formsStyle.form} form-container`}>
                <div className={formsStyle.block}>
                    <ValidationErrors errors={validationErrors} />

                    <gn-label block>
                        <label htmlFor="measure-progress">Status</label>
                    </gn-label>
                    <div data-color-mode="light">
                        {editableReport ? (
                            <MDEditor
                                id="measure-progress"
                                preview="edit"
                                height={200}
                                name="description"
                                value={measure?.progress || ""}
                                onChange={(value) => {
                                    handleChange({ name: "progress", value });
                                }}
                            />
                        ) : (
                            <MDEditor.Markdown id="measure-progress" source={measure?.progress || ""} />
                        )}
                    </div>

                    <div className={`${editableReport ? "" : `${formsStyle.flex}`}`}>
                        <div>
                            <gn-label block>
                                <label htmlFor="measure-volume">
                                    {dispatch(translate("Volume"))}
                                    <ToggleHelpText resourceKey="VolumeDescription" />{" "}
                                </label>
                            </gn-label>
                            {editableReport ? (
                                <gn-select>
                                    <select
                                        id="measure-volume"
                                        name="volume"
                                        value={measure.volume || 0}
                                        onSelect={(event) =>
                                            handleChange({ name: "volume", value: event?.target?.value })
                                        }
                                    >
                                        {measureVolume.map((measureVolumeOption) => {
                                            return (
                                                <option
                                                    key={measureVolumeOption.value}
                                                    value={measureVolumeOption.value}
                                                >
                                                    {measureVolumeOption.label}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </gn-select>
                            ) : (
                                <span>{renderStars(measure.volume || 0)}</span>
                            )}
                        </div>

                        <div>
                            <gn-label block>
                                <label htmlFor="measure-status">
                                    Status <ToggleHelpText resourceKey="StatusDescription" />
                                </label>
                            </gn-label>
                            {editableReport ? (
                                <gn-select>
                                    <select
                                        id="measure-status"
                                        name="status"
                                        defaultValue={measure.status || 1}
                                        onSelect={(event) =>
                                            handleChange({ name: "status", value: event?.target?.value })
                                        }
                                    >
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
                                <span>{getMeasureStatusLabel(planStatuses, measure)}</span>
                            )}
                        </div>

                        <div>
                            <gn-label block>
                                <label htmlFor="measure-trafficLight">
                                    {dispatch(translate("TrafficLight"))}
                                    <ToggleHelpText resourceKey="TrafficlightDescription" />{" "}
                                </label>
                            </gn-label>
                            {editableReport ? (
                                <gn-select>
                                    <select
                                        id="measure-trafficLight"
                                        name="trafficLight"
                                        defaultValue={measure.trafficLight || 1}
                                        onSelect={(event) =>
                                            handleChange({ name: "trafficLight", value: event?.target?.value })
                                        }
                                    >
                                        {trafficLights.map((trafficLight) => {
                                            return <option value={trafficLight.value}>{trafficLight.label}</option>;
                                        })}
                                    </select>
                                </gn-select>
                            ) : (
                                <span
                                    className={`${formsStyle.trafficLight} ${
                                        formsStyle["light-" + measure.trafficLight]
                                    }`}
                                ></span>
                            )}
                        </div>

                        <div>
                            <gn-label block>
                                <label htmlFor="measure-results">
                                    {dispatch(translate("Results"))} <ToggleHelpText resourceKey="ResultDescription" />
                                </label>
                            </gn-label>
                            {editableReport ? (
                                <gn-select>
                                    <select
                                        id="measure-results"
                                        name="results"
                                        defaultValue={measure.results || 1}
                                        onSelect={(event) =>
                                            handleChange({ name: "results", value: event?.target?.value })
                                        }
                                    >
                                        {measureResults.map((measureResult) => {
                                            return (
                                                <option key={measureResult.value} value={measureResult.value}>
                                                    {measureResult.label}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </gn-select>
                            ) : (
                                <span>{renderStars(measure.results || 0)}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <gn-label block>
                            <label>
                                {dispatch(translate("Comment"))}
                                <ToggleHelpText resourceKey="CommentDescription" />
                            </label>
                        </gn-label>
                        {editableReport ? (
                            <gn-textarea block fullWidth>
                                <textarea
                                    name="comment"
                                    defaultValue={measure.comment || ""}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </gn-textarea>
                        ) : (
                            <span>{measure.comment}</span>
                        )}
                    </div>
                </div>
            </div>
            {editableReport ? (
                canEditReport(authInfo, selectedMeasure.owner) ? (
                    <div>
                        <gn-button color="default">
                            <button onClick={() => setEditableReport(false)}>Avslutt redigering</button>
                        </gn-button>
                        <gn-button color="primary">
                            <button onClick={saveMeasure}>{dispatch(translate("btnSave"))}</button>
                        </gn-button>
                    </div>
                ) : null
            ) : (
                <div>
                    {canEditReport(authInfo, selectedMeasure.owner) ? (
                        <gn-button color="primary">
                            <button onClick={() => setEditableReport(true)}>
                                {dispatch(translate("btnEditReport"))}
                            </button>
                        </gn-button>
                    ) : null}
                </div>
            )}
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
                        <Modal.Title>{dispatch(translate("btnDelete"))}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Er du sikker på at du vil slette {measure.name}?</p>
                        {measure.activities.length > 0
                            ? "Du kan ikke slette da det er aktiviteter knyttet til tiltaket" + measure.name
                            : ""}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Avbryt
                        </Button>
                        <Button disabled={measure.activities.length > 0} variant="danger" onClick={handleDelete}>
                            Slett
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </React.Fragment>
    );
};

export default ReportDetails;
