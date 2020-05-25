import moment from "moment";

const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => moment(date).format(`HH:mm`);

const formatDate = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

const calculatePointDuration = (start, end) => {
  return moment.duration(moment(end).diff(moment(start)));
};

const getPointDurationInMs = (start, end) => {
  return calculatePointDuration(start, end).asMilliseconds();
};

const getPointDurationInDHM = (pointDuration) => {

  const dayCount = castDateTimeFormat(moment.duration(pointDuration, `milliseconds`).days());
  const hourCount = castDateTimeFormat(moment.duration(pointDuration, `milliseconds`).hours());
  const minutesCount = castDateTimeFormat(moment.duration(pointDuration, `milliseconds`).minutes());

  if (dayCount > 0) {
    return `${dayCount}D ${hourCount}H ${minutesCount}M`;
  } else if (hourCount > 0) {
    return `${hourCount}H ${minutesCount}M`;
  } else {
    return `${minutesCount}M`;
  }
};

const isFutureDate = (nowDate, startDate) => startDate > nowDate;

const isPastDate = (nowDate, endDate) => endDate < nowDate;

export {getPointDurationInDHM, getPointDurationInMs, castDateTimeFormat, formatDate, formatTime, isFutureDate, isPastDate};

