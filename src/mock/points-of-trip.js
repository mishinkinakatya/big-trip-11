import {ALL_DESTINATION, ALL_POINT_ACTION} from "../const.js";
import {getPointDurationInMs, generateRandomArrayItem, getRandomIntegerNumber, getPointDurationInDHM, getRandomStartDate, getRandomEndDate, POINTS_DESTINATION_WITH_DESCRIPTION, pointsActionWithOffers} from "../utils/common.js";
import PointModel from "../models/point-model.js";


const generatePointOfTrip = () => {
  const pointAction = generateRandomArrayItem(Object.keys(pointsActionWithOffers));
  const destination = generateRandomArrayItem(ALL_DESTINATION);
  const description = POINTS_DESTINATION_WITH_DESCRIPTION.find((it) => it.destination === destination).description;
  const typeWithPreposition = `${ALL_POINT_ACTION[pointAction]}`;
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);
  const durationInMs = getPointDurationInMs(startDate, endDate);
  const offers = pointsActionWithOffers[pointAction];

  const point = {
    id: String(new Date() + Math.random()),
    description,
    destination,
    duration: getPointDurationInDHM(startDate, endDate),
    durationInMs,
    endDate,
    isFavorite: Math.random() > 0.5,
    offers,
    photos: generatePhotoSrc(getRandomIntegerNumber(1, 5)),
    price: getRandomIntegerNumber(0, 100),
    startDate,
    type: pointAction,
    typeWithPreposition,
  };

  return new PointModel(point, point);
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
