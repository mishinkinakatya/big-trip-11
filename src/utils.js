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

const generateRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegeNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegeNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generateRandomArrayFromAnother = (initialArray, newArrayMinLength, newArrayMaxLength) => {
  const arrayLength = initialArray.length;
  const countItems = getRandomIntegeNumber(newArrayMinLength, newArrayMaxLength);
  const indexStart = getRandomIntegeNumber(0, arrayLength - 1);

  return initialArray.slice(indexStart, indexStart + countItems);
};

const getRandomStartDate = () => {
  const targetDate = new Date();
  const diffDate = getRandomIntegeNumber(0, 10);

  const diffHours = getRandomIntegeNumber(0, 23);
  const diffMinutes = getRandomIntegeNumber(0, 59);

  targetDate.setDate(targetDate.getDate() + diffDate);
  targetDate.setHours(targetDate.getHours() + diffHours);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const getRandomEndDate = (startDate) => {
  const targetDate = new Date(startDate);
  const diffDate = getRandomIntegeNumber(0, 10);

  const diffHours = diffDate === 0 ? getRandomIntegeNumber(targetDate.getHours(), 23) : getRandomIntegeNumber(0, 23);
  const diffMinutes = diffHours === 0 ? getRandomIntegeNumber(targetDate.getMinutes(), 59) : getRandomIntegeNumber(0, 59);

  targetDate.setDate(targetDate.getDate() + diffDate);
  targetDate.setHours(targetDate.getHours() + diffHours);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const calculateEventDuration = (diff) => {
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

export {castDateTimeFormat, formatTime, formatDate, generateRandomArrayItem, getRandomIntegeNumber, generateRandomArrayFromAnother, calculateEventDuration, getRandomStartDate, getRandomEndDate};

