import {EVENT_POINT, EVENT_ACTIVITY, EVENT_TRANSPORT, EVENT_DESTINATION, priceToOffer} from "../const.js";
import {generateRandomArrayItem, getRandomIntegeNumber, calculateEventDuration} from "../utils.js";

const generateDayEvent = () => {

  const eventPoint = generateRandomArrayItem(EVENT_POINT);
  const eventStartDate = getRandomStartDate();
  const eventEndDate = getRandomEndDate(eventStartDate);

  return {
    eventType: (eventPoint === `Check`) ? `check-in` : eventPoint,
    eventTitle: eventTitle(eventPoint),
    eventPrice: getRandomIntegeNumber(0, 100),
    eventStartDate,
    eventEndDate,
    eventDuration: calculateEventDuration(Date.parse(eventEndDate) - Date.parse(eventStartDate)),
  };
};

const generateDayEvents = (count) => {
  return new Array(count).fill(``).map(generateDayEvent);
};

const eventTitle = (eventPoint) => {
  if (EVENT_ACTIVITY.includes(eventPoint)) {
    return `${eventPoint} in ${generateRandomArrayItem(EVENT_DESTINATION)}`;
  }
  if (EVENT_TRANSPORT.includes(eventPoint)) {
    return `${eventPoint} to ${generateRandomArrayItem(EVENT_DESTINATION)}`;
  }
  return null;
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

const generateOffers = () => {
  return (Object.entries(priceToOffer)
  );
};

const tripDay = [
  `2019-03-18`,
];

export {generateDayEvent, generateDayEvents, generateOffers, tripDay};
