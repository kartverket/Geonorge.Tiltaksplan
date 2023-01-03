// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastr } from "react-redux-toastr";
import SimpleMDE from "react-simplemde-editor";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { fetchOrganizations } from "actions/OrganizationsActions";

// Components
import { SelectDropdown } from "components/custom-elements";

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

const EditMeasure = (props) => {
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
    const [selectedOwner, setSelectedOwner] = useState(props.selectedOwner);
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
        dispatch(
            deleteMeasure(measure, user).then(() => {
                console.log("har vi ikke slett??");
            })
        );
    };

    const saveMeasure = () => {
        if (selectedOwner.length) {
            measure.owner.id = setSelectedOwner(selectedOwner[0].id);
        }

        updateMeasure(measure, user)
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

                    <Form.Group controlId="formProgress">
                       
                        {editableReport ? ( 
                            <React.Fragment>
                               <label>Status
                                <div className={`${formsStyle.comboInput} ${formsStyle.fullWidth}`}>
                                    <SimpleMDE
                                        value={measure.progress || ""}
                                        onChange={(value) => handleChange({ name: "progress", value })}
                                        options={editableMdeOptions}
                                        getMdeInstance={getMdeInstance}
                                    />
                                </div></label>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {measure.progress || ""}
                            </React.Fragment>
                        )}
                    </Form.Group>
                    <div className={`${editableReport ? "" : `${formsStyle.flex}`}`}>
                        <Form.Group controlId="formVolume">
                            <Form.Label>
                                {dispatch(translate("Volume"))}
                                <ToggleHelpText resourceKey="VolumeDescription" />{" "}
                            </Form.Label>
                            {editableReport ? (
                                <div className={formsStyle.comboInput}>
                                    <SelectDropdown
                                        name="volume"
                                        value={measure.volume || 0}
                                        options={measureVolume}
                                        onSelect={handleChange}
                                        className={formsStyle.defaultSelect}
                                    />
                                </div>
                            ) : (
                                <span>{renderStars(measure.volume || 0)}</span>
                            )}
                        </Form.Group>

                        <Form.Group controlId="formStatus">
                            <Form.Label>
                                Status <ToggleHelpText resourceKey="StatusDescription" />
                            </Form.Label>
                            {editableReport ? (
                                <div className={formsStyle.comboInput}>
                                    <SelectDropdown
                                        name="status"
                                        value={measure.status || 1}
                                        options={planStatuses}
                                        onSelect={handleChange}
                                        className={formsStyle.defaultSelect}
                                    />
                                </div>
                            ) : (
                                <span>{getMeasureStatusLabel(planStatuses, measure)}</span>
                            )}
                        </Form.Group>

                        <Form.Group controlId="formTrafficLight">
                            <Form.Label>
                                {dispatch(translate("TrafficLight"))}
                                <ToggleHelpText resourceKey="TrafficlightDescription" />{" "}
                            </Form.Label>
                            {editableReport ? (
                                <div className={formsStyle.comboInput}>
                                    <SelectDropdown
                                        name="trafficLight"
                                        value={measure.trafficLight || 1}
                                        options={trafficLights}
                                        onSelect={handleChange}
                                        className={formsStyle.trafficLightSelect}
                                    />
                                </div>
                            ) : (
                                <span
                                    className={`${formsStyle.trafficLight} ${
                                        formsStyle["light-" + measure.trafficLight]
                                    }`}
                                ></span>
                            )}
                        </Form.Group>

                        <Form.Group controlId="formResults">
                            <Form.Label>
                                {dispatch(translate("Results"))} <ToggleHelpText resourceKey="ResultDescription" />
                            </Form.Label>

                            {editableReport ? (
                                <div className={formsStyle.comboInput}>
                                    <SelectDropdown
                                        name="results"
                                        value={measure.results || 1}
                                        options={measureResults}
                                        onSelect={handleChange}
                                        className={formsStyle.defaultSelect}
                                    />
                                </div>
                            ) : (
                                <span>{renderStars(measure.results || 0)}</span>
                            )}
                        </Form.Group>
                    </div>
                    <Form.Group controlId="formComments">
                        <Form.Label>
                            {dispatch(translate("Comment"))}
                            <ToggleHelpText resourceKey="CommentDescription" />
                        </Form.Label>
                        {editableReport ? (
                            <div className={`${formsStyle.comboInput} ${formsStyle.fullWidth}`}>
                                <Form.Control
                                    as="textarea"
                                    name="comment"
                                    value={measure.comment || ""}
                                    onChange={handleChange}
                                    rows={3}
                                />
                            </div>
                        ) : (
                            <span>{measure.comment}</span>
                        )}
                    </Form.Group>
                </div>
            </div>
            {editableReport ? (
                <div>
                    {canEditReport(authInfo, selectedMeasure.owner) ? (
                        <React.Fragment>
                            <Button className="mr-2" variant="secondary" onClick={() => setEditableReport(false)}>
                                Avslutt redigering
                            </Button>
                            <Button variant="primary" onClick={saveMeasure}>
                                {dispatch(translate("btnSave"))}
                            </Button>
                        </React.Fragment>
                    ) : (
                        ""
                    )}
                </div>
            ) : (
                <div>
                    {canEditReport(authInfo, selectedMeasure.owner) ? (
                        <Button variant="primary" onClick={() => setEditableReport(true)}>
                            {dispatch(translate("btnEditReport"))}
                        </Button>
                    ) : (
                        ""
                    )}
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

export default EditMeasure;
