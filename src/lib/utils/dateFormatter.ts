import moment from "moment";

export const formatDate = (date: string, format = 'DD-MM-YYYY HH:mm') => {
    return moment(date).format(format);
}