import {EVENT_POINT, EVENT_ACTIVITY, EVENT_TRANSPORT, EVENT_DESTINATION, EVENT_DESCRIPTION, priceToOffer} from "../const.js";
import {generateRandomArrayItem, getRandomIntegeNumber, calculateEventDuration, getRandomStartDate, getRandomEndDate} from "../utils.js";

const generateDayEvent = () => {

  const point = generateRandomArrayItem(EVENT_POINT);
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);

  return {
    type: (point === `Check`) ? `check-in` : point,
    title: generateTitle(point),
    price: getRandomIntegeNumber(0, 100),
    startDate,
    endDate,
    duration: calculateEventDuration(Date.parse(endDate) - Date.parse(startDate)),
    offers: generateOffers(),
    activity: EVENT_ACTIVITY,
    transport: EVENT_TRANSPORT,
    destination: EVENT_DESTINATION,
    description: EVENT_DESCRIPTION,
    photos: generatePhotoSrc(getRandomIntegeNumber(1, 5)),
  };
};

const generateDayEvents = (count) => {
  return new Array(count).fill(``).map(generateDayEvent);
};

const generateTitle = (point) => {
  let direction = ``;

  if (EVENT_ACTIVITY.includes(point)) {
    direction = `in`;
  }
  if (EVENT_TRANSPORT.includes(point)) {
    direction = `to`;
  }
  return `${point} ${direction} ${generateRandomArrayItem(EVENT_DESTINATION)}`;
};

const generateOffers = () => {
  return (Object.entries(priceToOffer)
  );
};

const generatePhotoSrc = (count) => {
  const allPhotos = [];
  for (let i = 0; i < count; i++) {
    allPhotos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return allPhotos;
};

export {generateDayEvents, generateOffers};
