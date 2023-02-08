// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import { toastr } from "react-redux-toastr";
import ValidationErrors from "components/partials/ValidationErrors";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { GnButton, GnDialog, GnInput, HeadingText } from "@kartverket/geonorge-web-components";

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
    const [measure, setMeasure] = useState(props.newMeasure ? new Measure() : props.selectedMeasure);
    const [selectedOwner, setSelectedOwner] = useState(props.newMeasure ? [] : [props.selectedMeasure.owner]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [dialogOpen, setDialogOpen] = useState([false]);

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
        if (data) {
            setSelectedOwner(data);
            if (data[0]?.id) {
                setMeasure({
                    ...measure,
                    owner: {
                        ...measure.owner,
                        id: data[0].id
                    }
                });
            }
        }
    };

    const handleChange = (data) => {
        const { name, value } = data.target ? data.target : data;
        const parsed = parseInt(value);
        measure[name] = isNaN(parsed) ? value : parsed;
        setMeasure(measure);
    };

    const saveMeasure = () => {
        props.newMeasure
            ? dispatch(createMeasure(measure, user))
                  .then(() => {
                      closeDialog();
                      setValidationErrors([]);
                      toastr.success("Et nytt tiltak ble lagt til");
                      props.onUpdate();
                  })
                  .catch(({ response }) => {
                      toastr.error("Kunne ikke opprette tiltak");
                      setValidationErrors(response.data);
                  })
            : dispatch(updateMeasure(measure, user))
                  .then(() => {
                      closeDialog(false);
                      setValidationErrors([]);
                      toastr.success("Tiltaket ble oppdatert");
                      props.onUpdate();
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

    const openDialog = () => {
        setDialogOpen(false);
        setTimeout(() => {
            setDialogOpen(true);
        });
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    return showAddMeasureContent() || showEditMeasureContent() ? (
        <React.Fragment>
            <gn-button color="primary">
                <button onClick={() => openDialog()}>{props.newMeasure ? "Opprett tiltak" : "Rediger tiltak"}</button>
            </gn-button>

            <gn-dialog show={dialogOpen}>
                <heading-text>
                    <h2>{props.newMeasure ? "Nytt tiltak" : `${measure.no} - ${measure.name}`}</h2>
                </heading-text>
                <ValidationErrors errors={validationErrors} />
                <gn-label block>
                    <label htmlFor="measure-no">Nummer</label>
                </gn-label>
                <gn-input block fullWidth>
                    <input id="measure-no" type="number" name="no" defaultValue={measure.no} onChange={handleChange} />
                </gn-input>

                <gn-label block>
                    <label htmlFor="measure-name">Navn</label>
                </gn-label>
                <gn-input block fullWidth>
                    <input
                        id="measure-name"
                        type="text"
                        name="name"
                        defaultValue={measure.name}
                        onChange={handleChange}
                    />
                </gn-input>

                <gn-label block>
                    <label htmlFor="measure-owner">Eier</label>
                </gn-label>
                <gn-input block fullWidth>
                    <Typeahead
                        id="measure-owner"
                        labelKey="name"
                        onChange={handleOwnerSelect}
                        options={organizations}
                        selected={selectedOwner}
                        placeholder="Legg til eier..."
                    />
                </gn-input>

                <gn-label block>
                    <label htmlFor="measure-infoUrl">Url</label>
                </gn-label>
                <gn-input block fullWidth>
                    <input
                        id="measure-infoUrl"
                        type="text"
                        name="infoUrl"
                        defaultValue={measure.infoUrl}
                        onChange={handleChange}
                        placeholder="http://www.name.org"
                    />
                </gn-input>

                <gn-button color="default">
                    <button onClick={() => closeDialog()}>Avbryt</button>
                </gn-button>
                <gn-button color="primary">
                    <button onClick={saveMeasure}>Lagre</button>
                </gn-button>
            </gn-dialog>
        </React.Fragment>
    ) : null;
};

export default MeasureDetails;
