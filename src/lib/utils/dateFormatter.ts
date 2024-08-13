import moment from "moment";

export const formatDate = (date: string, format = 'DD-MM-YYYY HH:mm') => {
    if (!date) return '';
    return moment(date).format(format);
}