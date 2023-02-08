// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveAs } from "file-saver";
// eslint-disable-next-line no-unused-vars
import { BreadcrumbList, ContentContainer, GnButton, HeadingText } from "@kartverket/geonorge-web-components";

// Components
import MeasureDetails from "components/partials/MeasureDetails";
import MeasuresTable from "components/partials/MeasuresTable";
import { translate } from "actions/ConfigActions";

// Helpers
import { convertMeasureReportsToCSV } from "helpers/csvHelpers";
import { fetchMeasures } from "actions/MeasuresActions";

const Measures = (props) => {
    const dispatch = useDispatch();

    // State
    const [measures, setMeasures] = useState();

    // Redux store
    const options = useSelector((state) => state.options);

    const saveCSVFileForMeasureReports = () => {
        const filename = "reports.csv";
        const BOM = "\uFEFF";
        const csvData = `${BOM} ${convertMeasureReportsToCSV(measures, options)}`;
        const blob = new Blob([csvData], {
            type: "text/csv;charset=utf-8"
        });
        saveAs(blob, filename);
    };

    const pageTitle = dispatch(translate("infoLinkMeasure"));
    const breadcrumbs = [
        {
            name: "Geonorge",
            url: "@AppSettings.UrlGeonorgeRoot"
        },
        {
            name: pageTitle,
            url: "/"
        }
    ];

    const handleMeasureDetailsUpdate = () => {
        dispatch(fetchMeasures()).then((response) => {
            setMeasures(response.payload);
        });
    };

    useEffect(() => {
        dispatch(fetchMeasures()).then((response) => {
            setMeasures(response.payload);
        });
    }, [dispatch]);

    return (
        <content-container>
            <breadcrumb-list id="breadcrumb-list" breadcrumbs={JSON.stringify(breadcrumbs)}></breadcrumb-list>
            <div id="main-content">
                <heading-text>
                    <h1 underline="true">{pageTitle}</h1>
                </heading-text>
                <MeasureDetails newMeasure onUpdate={handleMeasureDetailsUpdate} />
                {measures?.length && <MeasuresTable measures={measures} />}
                <gn-button color="default">
                    <button onClick={() => saveCSVFileForMeasureReports()}>Lagre som CSV</button>
                </gn-button>
            </div>
        </content-container>
    );
};

export default Measures;
