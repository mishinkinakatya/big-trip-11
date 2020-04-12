import {EVENT_POINT, EVENT_ACTIVITY, EVENT_TRANSPORT, EVENT_DESTINATION, priceToOffer} from "../const.js";
import {generateRandomArrayItem, getRandomIntegeNumber, calculateEventDuration, getRandomStartDate, getRandomEndDate} from "../utils.js";

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

const generateOffers = () => {
  return (Object.entries(priceToOffer)
  );
};

export {generateDayEvent, generateDayEvents, generateOffers};
