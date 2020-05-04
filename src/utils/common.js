import {ALL_DESTINATION, ALL_DESCRIPTION} from "../const.js";

const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castDateTimeFormat(date.getHours() % 12);
  const minutes = castDateTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  const day = castDateTimeFormat(date.getDate());
  const month = castDateTimeFormat(date.getMonth());
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

const formatDateTime = (date) => {
  const day = castDateTimeFormat(date.getDate());
  const month = castDateTimeFormat(date.getMonth());
  const year = String(date.getFullYear()).slice(2, 4);
  const hours = castDateTimeFormat(date.getHours() % 12);
  const minutes = castDateTimeFormat(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const generateRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generateRandomArrayFromAnother = (initialArray, newArrayMinLength, newArrayMaxLength) => {
  const arrayLength = initialArray.length;
  const countItems = getRandomIntegerNumber(newArrayMinLength, newArrayMaxLength);
  const indexStart = getRandomIntegerNumber(0, arrayLength - 1);

  return initialArray.slice(indexStart, indexStart + countItems);
};

const getRandomStartDate = () => {
  const targetDate = new Date();
  const diffDate = getRandomIntegerNumber(0, 10);

  const diffHours = getRandomIntegerNumber(0, 23);
  const diffMinutes = getRandomIntegerNumber(0, 59);

  targetDate.setDate(targetDate.getDate() + diffDate);
  targetDate.setHours(targetDate.getHours() + diffHours);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const getRandomEndDate = (startDate) => {
  const targetDate = new Date(startDate);
  const diffDate = getRandomIntegerNumber(0, 10);

  const diffHours = diffDate === 0 ? getRandomIntegerNumber(targetDate.getHours(), 23) : getRandomIntegerNumber(0, 23);
  const diffMinutes = diffHours === 0 ? getRandomIntegerNumber(targetDate.getMinutes(), 59) : getRandomIntegerNumber(0, 59);

  targetDate.setDate(targetDate.getDate() + diffDate);
  targetDate.setHours(targetDate.getHours() + diffHours);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const calculatePointDuration = (diff) => {
  const MS_IN_DAY = 86400000;
  const MS_IN_HOUR = 3600000;
  const MS_IN_MINUTE = 60000;

  const dayCount = castDateTimeFormat(Math.trunc(diff / MS_IN_DAY));

  diff -= dayCount * MS_IN_DAY;
  const hourCount = castDateTimeFormat(Math.trunc(diff / MS_IN_HOUR));
  diff -= hourCount * MS_IN_HOUR;
  const minutesCount = castDateTimeFormat(Math.trunc(diff / MS_IN_MINUTE));

  if (dayCount > 0) {
    return `${dayCount}D ${hourCount}H ${minutesCount}M`;
  } else if (hourCount > 0) {
    return `${hourCount}H ${minutesCount}M`;
  } else {
    return `${minutesCount}M`;
  }
};

const DescriptionLength = {
  min: 0,
  max: 5,
};

const getPointDestinationWithDescription = () => {
  return ALL_DESTINATION.map((it) => {
    return {
      destination: it,
      description: generateRandomArrayFromAnother(ALL_DESCRIPTION, DescriptionLength.min, DescriptionLength.max),
    };
  });
};

const POINT_DESTINATION_WITH_DESCRIPTION = getPointDestinationWithDescription();

const getPointDestination = () => {
  let POINT_DESTINATION = [];
  for (let value of POINT_DESTINATION_WITH_DESCRIPTION) {
    POINT_DESTINATION.push(value.destination);
  }
  return POINT_DESTINATION;
};

const getPointDescription = () => {
  let POINT_DESCRIPTION = [];
  for (let value of POINT_DESTINATION_WITH_DESCRIPTION) {
    POINT_DESCRIPTION.push(value.description);
  }
  return POINT_DESCRIPTION;
};

export {castDateTimeFormat, formatTime, formatDate, generateRandomArrayItem, getRandomIntegerNumber, generateRandomArrayFromAnother, calculatePointDuration, getRandomStartDate, getRandomEndDate, formatDateTime, getPointDestination, getPointDescription};

