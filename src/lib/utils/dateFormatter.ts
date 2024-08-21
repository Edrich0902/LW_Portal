import moment from "moment";

export const formatDate = (date: string | undefined, format = 'DD-MM-YYYY HH:mm') => {
    if (!date) return '';
    return moment(date).format(format);
}

export const formatTime = (time: string, format = 'HH:mm') => {
    if (!time) return '';
    return moment(time, 'HH:mm:ss').format(format);
}