import {POINT_ACTION, POINT_ACTIVITY, POINT_TRANSPORT, POINT_DESTINATION, POINT_DESCRIPTION, priceToOffer} from "../const.js";
import {generateRandomArrayItem, getRandomIntegeNumber, calculatePointDuration, getRandomStartDate, getRandomEndDate, generateRandomArrayFromAnother} from "../utils/common.js";

const generatePointOfTrip = () => {

  const pointAction = generateRandomArrayItem(POINT_ACTION);
  const destination = generateRandomArrayItem(POINT_DESTINATION);
  const typeWithPreposition = `${pointAction} ${addPreposition(pointAction)}`;
  const title = `${typeWithPreposition} ${destination}`;
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);
  const durationInMs = Date.parse(endDate) - Date.parse(startDate);
  const DescriptionLength = {
    min: 0,
    max: 5,
  };

  return {
    type: (pointAction === `Check`) ? `check-in` : pointAction,
    typeWithPreposition,
    destination,
    title,
    price: getRandomIntegeNumber(0, 100),
    startDate,
    endDate,
    durationInMs,
    duration: calculatePointDuration(durationInMs),
    offers: generateOffers(priceToOffer),
    allActivities: POINT_ACTIVITY,
    allTransports: POINT_TRANSPORT,
    allDestinations: POINT_DESTINATION,
    description: generateRandomArrayFromAnother(POINT_DESCRIPTION, DescriptionLength.min, DescriptionLength.max),
    photos: generatePhotoSrc(getRandomIntegeNumber(1, 5)),
    isFavorite: Math.random() > 0.5,
  };
};

const generatePointsOfTrip = (count) => {
  return new Array(count).fill(``).map(generatePointOfTrip);
};

const addPreposition = (point) => {
  let direction = ``;

  if (POINT_ACTIVITY.includes(point)) {
    direction = `in`;
  }
  if (POINT_TRANSPORT.includes(point)) {
    direction = `to`;
  }

  return direction;
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
