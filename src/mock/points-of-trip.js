import {POINT, POINT_ACTIVITY, POINT_TRANSPORT, POINT_DESTINATION, POINT_DESCRIPTION, priceToOffer} from "../const.js";
import {generateRandomArrayItem, getRandomIntegeNumber, calculatePointDuration, getRandomStartDate, getRandomEndDate, generateRandomArrayFromAnother} from "../utils/common.js";

const generatePointOfTrip = () => {

  const point = generateRandomArrayItem(POINT);
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);
  const durationInMs = Date.parse(endDate) - Date.parse(startDate);
  const DescriptionLength = {
    min: 0,
    max: 5,
  };

  return {
    type: (point === `Check`) ? `check-in` : point,
    title: generateTitle(point),
    price: getRandomIntegeNumber(0, 100),
    startDate,
    endDate,
    durationInMs,
    duration: calculatePointDuration(durationInMs),
    offers: generateOffers(priceToOffer),
    activity: POINT_ACTIVITY,
    transport: POINT_TRANSPORT,
    destination: POINT_DESTINATION,
    description: generateRandomArrayFromAnother(POINT_DESCRIPTION, DescriptionLength.min, DescriptionLength.max),
    photos: generatePhotoSrc(getRandomIntegeNumber(1, 5)),
  };
};

const generatePointsOfTrip = (count) => {
  return new Array(count).fill(``).map(generatePointOfTrip);
};

const generateTitle = (point) => {
  let direction = ``;

  if (POINT_ACTIVITY.includes(point)) {
    direction = `in`;
  }
  if (POINT_TRANSPORT.includes(point)) {
    direction = `to`;
  }
  return `${point} ${direction} ${generateRandomArrayItem(POINT_DESTINATION)}`;
};

const generateOffers = (offers) => {
  const allOffers = Object.entries(offers);
  const offersWithCheck = [];
  allOffers.forEach((offer) => {
    offersWithCheck.push(
        {
          type: offer[0],
          price: offer[1],
          isChecked: Math.random() > 0.5,
        });
  });
  return generateRandomArrayFromAnother(offersWithCheck, 0, offersWithCheck.length);
};

const generatePhotoSrc = (count) => {
  const allPhotos = [];
  for (let i = 0; i < count; i++) {
    allPhotos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return allPhotos;
};

export {generatePointsOfTrip};
