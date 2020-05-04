import {POINT_ACTIVITY, POINT_TRANSPORT, POINT_ACTION_WITH_OFFERS} from "../const.js";
import {generateRandomArrayItem, getRandomIntegerNumber, calculatePointDuration, getRandomStartDate, getRandomEndDate, getPointDestination, getPointDescription, getPointAction} from "../utils/common.js";

const POINT_ACTION = getPointAction();

const generatePointOfTrip = () => {

  const pointAction = generateRandomArrayItem(POINT_ACTION);
  const allDestinations = getPointDestination();
  const allDescriptions = getPointDescription();
  const destination = generateRandomArrayItem(allDestinations);
  const description = allDescriptions[allDestinations.findIndex((it) => it === destination)];
  const typeWithPreposition = `${pointAction} ${addPreposition(pointAction)}`;
  const title = `${typeWithPreposition} ${destination}`;
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);
  const durationInMs = Date.parse(endDate) - Date.parse(startDate);
  const offers = generateOffers(pointAction, POINT_ACTION_WITH_OFFERS);

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

const generateOffers = (pointType, points) => {
  const offersWithCheck = [];
  const offersForPointType = points.filter((point) => {
    return point.pointType === pointType;
  });
  offersForPointType.forEach((point) => {
    offersWithCheck.push(
        {
          type: point.offerType,
          price: point.offerPrice,
          isChecked: Math.random() > 0.5,
        });
  });
  return offersWithCheck;
};

const generatePhotoSrc = (count) => {
  const allPhotos = [];
  for (let i = 0; i < count; i++) {
    allPhotos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return allPhotos;
};

export {generatePointsOfTrip};
