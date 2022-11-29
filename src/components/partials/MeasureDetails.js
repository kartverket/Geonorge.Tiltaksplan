// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import { toastr } from "react-redux-toastr";
import ValidationErrors from "components/partials/ValidationErrors";

// Models
import { Measure } from "models/measure";

// Actions
import { fetchOrganizations } from "actions/OrganizationsActions";
import { createMeasure, updateMeasure } from "actions/MeasuresActions";

// Helpers
import { canAddMeasure, canEditMeasure } from "helpers/authorizationHelpers";

// Stylesheets
import "react-bootstrap-typeahead/css/Typeahead.css";

const MeasureDetails = (props) => {
    const dispatch = useDispatch();

    // State
    const [dataFetched, setDataFetched] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [measure, setMeasure] = useState(props.newMeasure ? new Measure() : props.selectedMeasure);
    const [selectedOwner, setSelectedOwner] = useState(props.newMeasure ? [] : [props.selectedMeasure.owner]);
    const [validationErrors, setValidationErrors] = useState([]);

    // Redux store
    const organizations = useSelector((state) => state.organizations);
    const user = useSelector((state) => state.oidc.user);
    const authInfo = useSelector((state) => state.authInfo);

    useEffect(() => {
        dispatch(fetchOrganizations()).then(() => {
            setDataFetched(true);
        });
    }, [dispatch]);

    const handleOwnerSelect = (data) => {
        setSelectedOwner(data);
    };

    const handleChange = (data) => {
        const { name, value } = data.target ? data.target : data;
        const parsed = parseInt(value);
        measure[name] = isNaN(parsed) ? value : parsed;
        setMeasure(measure);
    };

    const saveMeasure = () => {
        if (selectedOwner?.length) {
            setMeasure({
                ...measure,
                owner: {
                    ...measure.owner,
                    id: selectedOwner[0].id
                }
            });
        }

        props.newMeasure
            ? dispatch(createMeasure(measure, user))
                  .then(() => {
                      setModalOpen(false);
                      setValidationErrors([]);
                      toastr.success("Et nytt tiltak ble lagt til");
                  })
                  .catch(({ response }) => {
                      toastr.error("Kunne ikke opprette tiltak");
                      setValidationErrors(response.data);
                  })
            : dispatch(updateMeasure(measure, user))
                  .then(() => {
                      setModalOpen(false);
                      setValidationErrors([]);
                      toastr.success("Tiltaket ble oppdatert");
                  })
                  .catch(({ response }) => {
                      toastr.error("Kunne ikke oppdatere tiltak");
                      setValidationErrors(response.data);
                  });
    };

    const showAddMeasureContent = () => {
        return measure && props.newMeasure && canAddMeasure(authInfo);
    };

    const showEditMeasureContent = () => {
        return measure && !props.newMeasure && canEditMeasure(authInfo);
    };

    if (!dataFetched) {
        return "";
    }

    return showAddMeasureContent() || showEditMeasureContent() ? (
        <React.Fragment>
            <Button variant="primary" className="marginB-20" onClick={() => setModalOpen(true)}>
                {props.newMeasure ? "Opprett tiltak" : "Rediger tiltak"}
            </Button>
            <Modal
                show={modalOpen}
                onHide={() => setModalOpen(false)}
                backdrop="static"
                centered
                keyboard={false}
                animation={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{props.newMeasure ? "Nytt tiltak" : `${measure.no} - ${measure.name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ValidationErrors errors={validationErrors} />

                    <Form.Group controlId="formNo">
                        <Form.Label>Nummer</Form.Label>
                        <Form.Control type="number" name="no" defaultValue={measure.no} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formName">
                        <Form.Label>Navn</Form.Label>
                        <Form.Control type="text" name="name" defaultValue={measure.name} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formName">
                        <Form.Label>Eier</Form.Label>
                        <Typeahead
                            id="basic-typeahead-single"
                            labelKey="name"
                            onChange={handleOwnerSelect}
                            options={organizations}
                            selected={selectedOwner}
                            placeholder="Legg til eier..."
                        />
                    </Form.Group>
                    <Form.Group controlId="formInfoUrl">
                        <Form.Label>Url</Form.Label>
                        <Form.Control
                            type="text"
                            name="infoUrl"
                            defaultValue={measure.infoUrl}
                            onChange={handleChange}
                            placeholder="http://www.name.org"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalOpen(false)}>
                        Avbryt
                    </Button>
                    <Button variant="primary" onClick={saveMeasure}>
                        Lagre
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    ) : null;
};

export default MeasureDetails;
