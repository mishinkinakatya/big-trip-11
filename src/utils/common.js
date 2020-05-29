import moment from "moment";

const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => moment(date).format(`HH:mm`);

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
    if (hourCount === `00` && minutesCount === `00`) {
      return `${dayCount}D`;
    } else if (minutesCount === `00`) {
      return `${dayCount}D ${hourCount}H`;
    }
    return `${dayCount}D ${hourCount}H ${minutesCount}M`;
  } else if (hourCount > `00`) {
    return minutesCount === `00` ? `${hourCount}H` : `${hourCount}H ${minutesCount}M`;
  }
  return `${minutesCount}M`;
};

const deepCopy = (inObject) => {
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
      outObject[key] = deepCopy(value);
    }
  }

  return outObject;
};

const parseDate = (inputDate) => {
  return {
    date: inputDate.slice(8, 10),
    month: inputDate.slice(5, 7),
  };
};

const isFutureDate = (nowDate, startDate) => startDate > nowDate;

const isPastDate = (nowDate, endDate) => endDate < nowDate;

export {deepCopy, getPointDurationInDHM, getPointDurationInMs, castDateTimeFormat, formatTime, isFutureDate, isPastDate, parseDate};

