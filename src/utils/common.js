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

const getPointDurationInDHM = (pointDurationInMs) => {

  const dayCount = castDateTimeFormat(moment.duration(pointDurationInMs, `milliseconds`).days());
  const hourCount = castDateTimeFormat(moment.duration(pointDurationInMs, `milliseconds`).hours());
  const minutesCount = castDateTimeFormat(moment.duration(pointDurationInMs, `milliseconds`).minutes());

  if (dayCount > 0) {
    return `${dayCount}D ${hourCount}H ${minutesCount}M`;
  } else if (hourCount > 0) {
    return `${hourCount}H ${minutesCount}M`;
  } else {
    return `${minutesCount}M`;
  }
};

const deepCopyFunction = (inObject) => {
  let outObject;
  let value;
  let key;

  if (typeof inObject !== `object` || inObject === null) {
    return inObject;
  }

  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    if ({}.hasOwnProperty.call(inObject, key)) {
      value = inObject[key];
      outObject[key] = deepCopyFunction(value);
    }
  }

  return outObject;
};

const isFutureDate = (nowDate, startDate) => startDate > nowDate;

const isPastDate = (nowDate, endDate) => endDate < nowDate;

export {deepCopyFunction, getPointDurationInDHM, getPointDurationInMs, castDateTimeFormat, formatDate, formatTime, isFutureDate, isPastDate};

