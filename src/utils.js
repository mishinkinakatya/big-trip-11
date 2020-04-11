const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castDateTimeFormat(date.getHours() % 12);
  const minutes = castDateTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  const day = castDateTimeFormat(date.getDay());
  const month = castDateTimeFormat(date.getMonth());
  const year = castDateTimeFormat(date.getFullYear());

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

export {castDateTimeFormat, formatTime, formatDate, generateRandomArrayItem, getRandomIntegeNumber, generateRandomArrayFromAnother};
