import {POINT_ACTIVITY, POINT_TRANSPORT} from "../const.js";
import {generateRandomArrayItem, getRandomIntegerNumber, calculatePointDuration, getRandomStartDate, getRandomEndDate, getPointDestination, getPointDescription, POINT_WITH_OFFERS, addPreposition} from "../utils/common.js";

console.log(POINT_WITH_OFFERS);

const generatePointOfTrip = () => {

  const pointAction = generateRandomArrayItem(Object.keys(POINT_WITH_OFFERS));
  const allDestinations = getPointDestination();
  const allDescriptions = getPointDescription();
  const destination = generateRandomArrayItem(allDestinations);
  const description = allDescriptions[allDestinations.findIndex((it) => it === destination)];
  const typeWithPreposition = `${pointAction} ${addPreposition(pointAction)}`;
  const title = `${typeWithPreposition} ${destination}`;
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);
  const durationInMs = Date.parse(endDate) - Date.parse(startDate);
  const offers = POINT_WITH_OFFERS[pointAction];

  return {
    type: (pointAction === `Check`) ? `check-in` : pointAction,
    typeWithPreposition,
    destination,
    title,
    price: getRandomIntegerNumber(0, 100),
    startDate,
    endDate,
    durationInMs,
    duration: calculatePointDuration(durationInMs),
    offers,
    allActivities: POINT_ACTIVITY,
    allTransports: POINT_TRANSPORT,
    allDestinations,
    allDescriptions,
    description,
    photos: generatePhotoSrc(getRandomIntegerNumber(1, 5)),
    isFavorite: Math.random() > 0.5,
  };
};

const generatePointsOfTrip = (count) => {
  return new Array(count).fill(``).map(generatePointOfTrip);
};





const generatePhotoSrc = (count) => {
  const allPhotos = [];
  for (let i = 0; i < count; i++) {
    allPhotos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return allPhotos;
};

export {generatePointsOfTrip};
