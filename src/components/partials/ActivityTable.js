// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { GnTable } from "@kartverket/geonorge-web-components/GnTable";

// Components
import ActivityTableRow from "components/partials/ActivityTable/ActivityTableRow";
import { fetchOptions } from "actions/OptionsActions";
import { translate } from "actions/ConfigActions";


const ActivityTable = (props) => {
    const dispatch = useDispatch();

    // State
    const [dataFetched, setDataFetched] = useState(false);

    // Redux store
    const planStatuses = useSelector((state) => state.options.planStatuses);

    useEffect(() => {
        dispatch(fetchOptions()).then(() => {
            setDataFetched(true);
        });
    }, [dispatch]);

    const renderActivityTableRows = (activities) => {
        if (!activities?.length) {
            return (
                <div>
                    <p>Tekst mangler</p>
                </div>
            );
        }

        return (
            <gn-table>
                <table>
                    <thead>
                        <tr>
                            <th>NR</th>
                            <th>{dispatch(translate("Name"))}</th>
                            <th>{dispatch(translate("Description"))}</th>
                            <th>{dispatch(translate("Participants"))}</th>
                            <th>Status</th>
                            <th>{dispatch(translate("Start"))}</th>
                            <th>{dispatch(translate("End"))}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity) => (
                            <ActivityTableRow key={activity.id} activity={activity} planStatuses={planStatuses} />
                        ))}
                    </tbody>
                </table>
            </gn-table>
        );
    };

    if (!dataFetched || !props.activities) {
        return "";
    }

    return renderActivityTableRows(props.activities);
};

export default ActivityTable;
