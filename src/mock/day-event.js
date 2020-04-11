import {EVENT_POINT, EVENT_STATION, EVENT_MOTION, EVENT_DESTINATION, priceToOffer} from "../const.js";
import {castDateTimeFormat, generateRandomArrayItem, getRandomIntegeNumber} from "../utils.js";

const generateDayEvent = () => {

  const eventPoint = generateRandomArrayItem(EVENT_POINT);
  const eventStartDay = getRandomStartDate();
  const eventEndDay = getRandomEndDate(eventStartDay);

  return {
    eventType: (eventPoint === `Check`) ? `check-in` : eventPoint,
    eventTitle: eventTitle(eventPoint),
    eventPrice: getRandomIntegeNumber(0, 100),
    eventStartTime: `${castDateTimeFormat(getRandomIntegeNumber(0, 23))}:${castDateTimeFormat(getRandomIntegeNumber(0, 59))}`,
    eventEndTime: `${castDateTimeFormat(getRandomIntegeNumber(0, 23))}:${castDateTimeFormat(getRandomIntegeNumber(0, 59))}`,
    eventStartDay,
    eventEndDay,
  };
};

const generateDayEvents = (count) => {
  return new Array(count).fill(``).map(generateDayEvent);
};

const eventTitle = (eventPoint) => {
  if (EVENT_STATION.includes(eventPoint)) {
    return `${eventPoint} in ${generateRandomArrayItem(EVENT_DESTINATION)}`;
  }
  if (EVENT_MOTION.includes(eventPoint)) {
    return `${eventPoint} to ${generateRandomArrayItem(EVENT_DESTINATION)}`;
  }
  return null;
};

const getRandomStartDate = () => {
  const targetDate = new Date();
  const diffValue = getRandomIntegeNumber(1, 28);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const getRandomEndDate = (day) => {
  const targetDate = day;
  const diffValue = getRandomIntegeNumber(1, 28);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const generateOffers = () => {
  return (Object.entries(priceToOffer)
  );
};

export {generateDayEvent, generateDayEvents, generateOffers};
