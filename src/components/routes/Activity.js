// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { BreadcrumbList, ContentContainer, HeadingText } from "@kartverket/geonorge-web-components";

// Components
import ActivityDetails from "components/partials/ActivityDetails";

// Actions
import { fetchMeasure } from "actions/MeasuresActions";
import { fetchActivity } from "actions/ActivityActions";
import { translate } from "actions/ConfigActions";

// Helpers
import { getEnvironmentVariable } from "helpers/environmentVariableHelpers.js";
import { Helmet } from "react-helmet-async";

const Activity = (props) => {
    // Redux store
    const activity = useSelector((state) => state.activities.selectedActivity);

    // State
    const [dataFetched, setDataFetched] = useState(false);

    // Params
    const { measureNumber, activityNumber } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        const promises = [dispatch(fetchMeasure(measureNumber))];

        if (activityNumber) {
            promises.push(dispatch(fetchActivity(measureNumber, activityNumber)));
        }

        Promise.all(promises).then(() => {
            setDataFetched(true);
        });
    }, [activityNumber, dispatch, measureNumber]);

    const measureActivitiesTitle = dispatch(translate("MeasureActivitiesTitle"));
    const measureTitle = dispatch(translate("infoLinkMeasure"));
    const pageTitle = !!activityNumber ? activity.name : "Opprett aktivitet";
    const pageUrl = !!activityNumber ? `/tiltak/${measureNumber}/aktivitet/${activityNumber}` : `/tiltak/${measureNumber}/ny-aktivitet`;
    const urlGeonorgeRoot = getEnvironmentVariable("UrlGeonorgeRoot");
    const breadcrumbs = [
        {
            name: "Geonorge",
            url: urlGeonorgeRoot
        },
        {
            name: "Tiltaksplan",
            url: "/"
        },
        {
            name: `Tiltak ${measureNumber}`,
            url: `/tiltak/${measureNumber}`
        },
        {
            name: pageTitle,
            url: pageUrl
        }
    ];

    return (
        dataFetched && (
            <content-container>
                <breadcrumb-list id="breadcrumb-list" breadcrumbs={JSON.stringify(breadcrumbs)}></breadcrumb-list>
                 <Helmet><title>{pageTitle}</title></Helmet>
                <div id="main-content">
                    
                    <heading-text>
                        <h1 underline="true">{pageTitle}</h1>
                    </heading-text>
                    <ActivityDetails newActivity={!activityNumber} />
                </div>
            </content-container>
        )
    );
};

export default Activity;
