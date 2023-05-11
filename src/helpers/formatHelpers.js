export const formatInputDateValue = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1 > 9 ? dateObject.getMonth() + 1 : `0${dateObject.getMonth() + 1}`;
    const day = dateObject.getDate() > 9 ? dateObject.getDate() : `0${dateObject.getDate()}`;
    return `${year}-${month}-${day}`;
};
