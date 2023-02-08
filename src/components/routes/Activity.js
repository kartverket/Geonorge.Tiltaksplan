// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import Container from "components/template/Container";
import ActivityDetails from "components/partials/ActivityDetails";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { HeadingText } from "@kartverket/geonorge-web-components";

// Actions
import { fetchMeasure } from "actions/MeasuresActions";
import { fetchActivity } from "actions/ActivityActions";
import { useParams } from "react-router";

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

    return (
        dataFetched && (
            <Container>
                <div id="main-content">
                    <heading-text>
                        <h1 underline="true">{!!activityNumber ? activity.name : "Opprett aktivitet"}</h1>
                    </heading-text>
                    <ActivityDetails newActivity={!activityNumber} />
                </div>
            </Container>
        )
    );
};

export default Activity;
