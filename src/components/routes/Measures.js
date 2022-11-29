// Dependencies
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveAs } from "file-saver";
import Button from "react-bootstrap/Button";
import { BreadcrumbList } from '@kartverket/geonorge-web-components';

// Components
import Container from "components/template/Container";
import MeasureDetails from "components/partials/MeasureDetails";
import MeasuresTable from "components/partials/MeasuresTable";
import { translate } from "actions/ConfigActions";


// Helpers
import { convertMeasureReportsToCSV } from "helpers/csvHelpers";

const Measures = (props) => {
    const dispatch = useDispatch();

    // Redux store
    const measures = useSelector((state) => state.measures);
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
    ]

    return (
        <Container>
            <breadcrumb-list id="breadcrumb-list" breadcrumbs={JSON.stringify(breadcrumbs)}></breadcrumb-list>
            <h1>{pageTitle}</h1>
            <MeasureDetails newMeasure />
            <MeasuresTable measures={measures} />
            <Button variant="secondary" onClick={() => saveCSVFileForMeasureReports()}>
                Lagre som CSV
            </Button>
        </Container>
    );
};

export default Measures;
