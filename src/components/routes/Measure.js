// Dependecies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DayJS from "react-dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import Container from "components/template/Container";
import MeasureDetails from "components/partials/MeasureDetails";
import ReportDetails from "components/partials/ReportDetails";
import ActivityTable from "components/partials/ActivityTable";

// Actions
import { fetchMeasure, deleteMeasure } from "actions/MeasuresActions";
import { translate } from "actions/ConfigActions";

// Helpers
import { canDeleteMeasure, canAddActivity } from "helpers/authorizationHelpers";

// Stylesheets
import style from "components/routes/Measure.module.scss";

const Measure = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Params
    const { measureNumber } = useParams();

    // State
    const [dataFetched, setDataFetched] = useState(false);
    const [deleteMeasureModalOpen, setDeleteMeasureModalOpen] = useState(false);
    const [open, setOpen] = useState(false);

    // Redux store
    const measure = useSelector((state) => state.measures.selectedMeasure);
    const user = useSelector((state) => state.oidc.user);
    const authInfo = useSelector((state) => state.authInfo);

    useEffect(() => {
        if (!dataFetched) {
            dispatch(fetchMeasure(measureNumber)).then(() => {
                setDataFetched(true);
            });
        }
    }, [dispatch, measureNumber, dataFetched]);

    const handleDeleteMeasure = () => {
        dispatch(
            deleteMeasure(measure, user).then(() => {
                navigate("/");
            })
        );
    };

    const hasMeasure = measure && Object.keys(measure)?.length;
    return dataFetched && hasMeasure ? (
        <Container>
            <h1>
                {measure.no} - {measure.name}
            </h1>
            {measure.infoUrl ? <a href={`${measure.infoUrl}`}>{dispatch(translate("infoLinkMeasure"))}</a> : ""}
            <h5>
                {dispatch(translate("OwnsBy"))} {measure.owner.name}
            </h5>
            {canDeleteMeasure(authInfo) ? (
                <Button className="mr-2" variant="secondary" onClick={setDeleteMeasureModalOpen(true)}>
                    Slett tiltaket
                </Button>
            ) : null}
            <MeasureDetails selectedMeasure={measure} />
            <div
                className={style.btn}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                {open ? `${dispatch(translate("ReportLinkClose"))}` : `${dispatch(translate("ReportLink"))}`}{" "}
                {<FontAwesomeIcon icon={open ? "minus-circle" : "plus-circle"} />}
            </div>

            <div className={`${style.reporting} ${open ? style.reportOpen : style.reportClose}`}>
                <h2>{dispatch(translate("progressReportTitle"))}</h2>
                <p>
                    {dispatch(translate("lastUpdate"))}{" "}
                    <DayJS format="DD.MM YYYY" locale="nb">
                        {measure.lastUpdated}
                    </DayJS>
                </p>
                <ReportDetails />
            </div>

            <h2>{dispatch(translate("MeasureActivitiesTitle"))}</h2>
            <ActivityTable activities={measure.activities} />

            {canAddActivity(authInfo, measure.owner) ? (
                <div className={style.block}>
                    <Link to={`/tiltak/${measureNumber}/ny-aktivitet`}>
                        <button className="btn btn-primary">{dispatch(translate("btnCreateActivity"))}</button>
                    </Link>
                </div>
            ) : null}

            <Modal
                show={deleteMeasureModalOpen}
                onHide={() => setDeleteMeasureModalOpen(false)}
                keyboard={false}
                animation={false}
                centered
                backdrop="static"
                aria-labelledby="form-dialog-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Slett tiltak</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Er du sikker på at du vil slette {measure.name}?</p>
                    {measure.activities.length > 0
                        ? "Du kan ikke slette da det er aktiviteter knyttet til tiltaket" + measure.name
                        : ""}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteMeasureModalOpen(false)}>
                        Avbryt
                    </Button>
                    <Button disabled={measure.activities.length > 0} variant="danger" onClick={handleDeleteMeasure}>
                        Slett
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    ) : null;
};

export default Measure;
