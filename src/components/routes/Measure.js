// Dependecies
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import DayJS from "react-dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { BreadcrumbList, ContentContainer, GnAccordion, GnButton, GnDialog, HeadingText } from "@kartverket/geonorge-web-components";

// Components
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
    const [deleteMeasureDialogOpen, setDeleteMeasureDialogOpen] = useState(false);

    // Redux store
    const measure = useSelector((state) => state.measures.selectedMeasure);
    const user = useSelector((state) => state.oidc.user);
    const authInfo = useSelector((state) => state.authInfo);

    const hasMeasure = measure && Object.keys(measure)?.length;

    const handleDeleteMeasure = () => {
        dispatch(
            deleteMeasure(measure, user).then(() => {
                navigate("/");
            })
        );
    };

    useEffect(() => {
        if (!dataFetched) {
            dispatch(fetchMeasure(measureNumber)).then(() => {
                setDataFetched(true);
            });
        }
    }, [dispatch, measureNumber, dataFetched]);

    const measureActivitiesTitle = dispatch(translate("MeasureActivitiesTitle"));
    const pageTitle = dispatch(translate("infoLinkMeasure"));
    const breadcrumbs = [
        {
            name: "Geonorge",
            url: "@AppSettings.UrlGeonorgeRoot"
        },
        {
            name: measureActivitiesTitle,
            url: "/"
        },
        {
            name: pageTitle,
            url: `/tiltak/${measureNumber}`
        }
    ];

    const openDeleteMeasureDialog = () => {
        setDeleteMeasureDialogOpen(false);
        setTimeout(() => {
            setDeleteMeasureDialogOpen(true);
        });
    };

    const closeDeleteMeasureDialog = () => {
        setDeleteMeasureDialogOpen(false);
    };

   
    return (
        <content-container>
            <breadcrumb-list id="breadcrumb-list" breadcrumbs={JSON.stringify(breadcrumbs)}></breadcrumb-list>
            {dataFetched && hasMeasure ? (
                <Fragment>
                    <div id="main-content">
                        <heading-text>
                            <h1 underline="true">
                                {measure.no} - {measure.name}
                            </h1>
                        </heading-text>
                        {measure.infoUrl ? (
                            <a href={`${measure.infoUrl}`} target="_blank" rel="noreferrer">
                                {dispatch(translate("infoLinkMeasure"))}
                            </a>
                        ) : (
                            ""
                        )}
                        <FontAwesomeIcon
                            data-tip="Detaljert beskrivelse - aktiviteter"
                            icon="external-link-alt"
                            className={style.icon}
                            color="#3767c7"
                            tabIndex="-1"
                        />

                        <p className="">
                            {dispatch(translate("OwnsBy"))} {measure.owner.name}
                        </p>
                        {canDeleteMeasure(authInfo) ? (
                            <gn-button color="default">
                                <button onClick={() => openDeleteMeasureDialog()}>Slett tiltaket</button>
                            </gn-button>
                        ) : null}

                        <MeasureDetails selectedMeasure={measure} />

                        <gn-accordion title={dispatch(translate("progressReportTitle"))}>
                            <p>
                                {dispatch(translate("lastUpdate"))}{" "}
                                <DayJS format="DD.MM YYYY" locale="nb">
                                    {measure.lastUpdated}
                                </DayJS>
                            </p>
                            <ReportDetails />
                        </gn-accordion>

                        <heading-text>
                            <h2>{dispatch(translate("MeasureActivitiesTitle"))}</h2>
                        </heading-text>
                        <ActivityTable activities={measure.activities} />

                        {canAddActivity(authInfo, measure.owner) ? (
                            <div className={style.block}>
                                <Link to={`/tiltak/${measureNumber}/ny-aktivitet`}>
                                    <gn-button color="primary">
                                        <button>{dispatch(translate("btnCreateActivity"))}</button>
                                    </gn-button>
                                </Link>
                            </div>
                        ) : null}

                        <gn-dialog show={deleteMeasureDialogOpen}>
                            <heading-text>
                                <h2>Slett tiltak</h2>
                            </heading-text>
                            <p>Er du sikker på at du vil slette {measure.name}?</p>
                            {measure.activities.length > 0
                                ? "Du kan ikke slette da det er aktiviteter knyttet til tiltaket" + measure.name
                                : ""}
                            <div>
                                <gn-button color="default">
                                    <button onClick={() => closeDeleteMeasureDialog()}>Avbryt</button>
                                </gn-button>
                                <gn-button color="danger">
                                    <button disabled={measure.activities.length > 0} onClick={handleDeleteMeasure}>
                                        Slett
                                    </button>
                                </gn-button>
                            </div>
                        </gn-dialog>
                    </div>
                </Fragment>
            ) : null}
        </content-container>
    );
};

export default Measure;
