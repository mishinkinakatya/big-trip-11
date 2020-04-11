export const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castDateTimeFormat(date.getHours() % 12);
  const minutes = castDateTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDate = (date) => {
  const day = castDateTimeFormat(date.getDay());
  const month = castDateTimeFormat(date.getMonth());
  const year = castDateTimeFormat(date.getFullYear());

  return `${year}-${month}-${day}`;
};

export const generateRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegeNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegeNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};
