import moment from 'moment/moment';

export const handleFormatDate = (date) => {
  return moment(date).format('DD/MM/YYYY HH:mm:ss');
};
