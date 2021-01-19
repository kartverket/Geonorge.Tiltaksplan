
const convertSelectedPropertiesToCSV = (dataObject) => {
    return Object.keys(dataObject).map(property => {
        const propertyValue = dataObject[property];
        return typeof propertyValue === 'string' ? `"${propertyValue}"` : propertyValue;
    }).join(';');
}

const convertObjectArrayToCSV = (objectArray = []) => {
    if (objectArray.length) {
        const headers = Object.keys(objectArray[0]).join(';');
        const values = objectArray.map(dataObject => {
            const csvLine = convertSelectedPropertiesToCSV(dataObject);
            return csvLine;
        }).join('\r\n');
        return `${headers}\r\n${values}`;
    } else {
        return null;
    }
}

const getOptionLabelFromValue = (options = {}, optionsType = "", optionValue) => {
    return options && options[optionsType] && options[optionsType].length
        ? options[optionsType].find(option => {
            return option.value === optionValue;
        }).label
        : null
}


export const convertMeasureReportsToCSV = (measureReports = [], options) => {
    const objectArray = measureReports.map(measureReport => {
        return {
            "id": measureReport.id,
            "nr": measureReport.no,
            "fremdrift": measureReport.progress,
            "volum": getOptionLabelFromValue(options, 'measureVolume', measureReport.volume),
            "status": getOptionLabelFromValue(options, 'planStatuses', measureReport.status),
            "trafikklys": getOptionLabelFromValue(options, 'trafficLights', measureReport.trafficLight),
            "konkrete resultater": getOptionLabelFromValue(options, 'measureResults', measureReport.results),
            "kommentar": measureReport.comment
        }
    });
    return convertObjectArrayToCSV(objectArray);
}