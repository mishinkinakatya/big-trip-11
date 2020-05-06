import {POINT_ACTIVITY, POINT_TRANSPORT, ALL_POINT_ACTION, ALL_DESTINATION} from "../const.js";
import {generateRandomArrayItem, getRandomIntegerNumber, calculatePointDuration, getRandomStartDate, getRandomEndDate, POINTS_DESTINATION_WITH_DESCRIPTION, POINTS_ACTION_WITH_OFFERS} from "../utils/common.js";


const generatePointOfTrip = () => {
  const pointAction = generateRandomArrayItem(Object.keys(POINTS_ACTION_WITH_OFFERS));
  const allDestinations = ALL_DESTINATION;
  const destination = generateRandomArrayItem(allDestinations);
  const description = POINTS_DESTINATION_WITH_DESCRIPTION.find((it) => it.destination === destination).description;
  const typeWithPreposition = `${ALL_POINT_ACTION[pointAction]}`;
  const title = `${typeWithPreposition} ${destination}`;
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);
  const durationInMs = Date.parse(endDate) - Date.parse(startDate);
  const offers = POINTS_ACTION_WITH_OFFERS[pointAction];

  return {
    type: pointAction,
    typeWithPreposition,
    destination,
    title,
    price: getRandomIntegerNumber(0, 100),
    startDate,
    endDate,
    durationInMs,
    duration: calculatePointDuration(durationInMs),
    offers,
    allActivities: Object.keys(POINT_ACTIVITY),
    allTransports: Object.keys(POINT_TRANSPORT),
    allDestinations,
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
