
const convertSelectedPropertiesToCSV = (properties, dataObject) => {
    return properties.map(property => {
        const propertyValue = dataObject[property];
        return typeof propertyValue === 'string' ? `"${propertyValue}"` : propertyValue;
    }).join(';');
}

const convertObjectArrayToCSV = (properties, objectArray) => {
    const headers = properties.join(';');
    const values = objectArray.map(dataObject => {
        const csvLine = convertSelectedPropertiesToCSV(properties, dataObject);
        return csvLine;
    }).join('\r\n');
    return `${headers}\r\n${values}`;
}

export const convertMeasureReportsToCSV = (objArray = []) => {
    const properties = [
        'id', 'no', 'progress', 'volume', 'status', 'trafficLights', 'results', 'comment'
    ];
    return convertObjectArrayToCSV(properties, objArray);
}