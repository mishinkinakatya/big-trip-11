import {ALL_DESTINATION, ALL_DESCRIPTION, ALL_POINT_ACTION, ACTIONS_WITH_OFFERS} from "../const.js";
import moment from "moment";

const DescriptionLength = {
  min: 0,
  max: 5,
};

const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => moment(date).format(`HH:mm`);

const formatDate = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

const generateRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generateRandomArrayFromAnother = (initialArray, newArrayMinLength, newArrayMaxLength) => {
  const arrayLength = initialArray.length;
  const countItems = getRandomIntegerNumber(newArrayMinLength, newArrayMaxLength);
  const indexStart = getRandomIntegerNumber(0, arrayLength - 1);

  return initialArray.slice(indexStart, indexStart + countItems);
};

const getRandomStartDate = () => {
  const targetDate = new Date();
  const diffDate = getRandomIntegerNumber(-10, 10);

  const diffHours = getRandomIntegerNumber(0, 23);
  const diffMinutes = getRandomIntegerNumber(0, 59);

  targetDate.setDate(targetDate.getDate() + diffDate);
  targetDate.setHours(targetDate.getHours() + diffHours);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const getRandomEndDate = (startDate) => {
  const targetDate = new Date(startDate);
  const diffDate = getRandomIntegerNumber(0, 10);

  const diffHours = diffDate === 0 ? getRandomIntegerNumber(targetDate.getHours(), 23) : getRandomIntegerNumber(0, 23);
  const diffMinutes = diffHours === 0 ? getRandomIntegerNumber(targetDate.getMinutes(), 59) : getRandomIntegerNumber(0, 59);

  targetDate.setDate(targetDate.getDate() + diffDate);
  targetDate.setHours(targetDate.getHours() + diffHours);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const calculatePointDuration = (start, end) => {
  return moment.duration(moment(end).diff(moment(start)));
};

const getPointDurationInMs = (start, end) => {
  return calculatePointDuration(start, end).asMilliseconds();
};

const getPointDurationInDHM = (start, end) => {
  const duration = calculatePointDuration(start, end);

  const dayCount = castDateTimeFormat(duration.days());
  const hourCount = castDateTimeFormat(duration.hours());
  const minutesCount = castDateTimeFormat(duration.minutes());

  if (dayCount > 0) {
    return `${dayCount}D ${hourCount}H ${minutesCount}M`;
  } else if (hourCount > 0) {
    return `${hourCount}H ${minutesCount}M`;
  } else {
    return `${minutesCount}M`;
  }
};

// Пока генерирую сама - реализовала функцию.
const generateDescriptionsForDestinations = (destinations, descriptions) => {
  return destinations.map((it) => {
    return {
      destination: it,
      description: generateRandomArrayFromAnother(descriptions, DescriptionLength.min, DescriptionLength.max),
    };
  });
};
// Когда данные будут приходить с сервера - эта константа переедет в point-edit
const POINTS_DESTINATION_WITH_DESCRIPTION = generateDescriptionsForDestinations(ALL_DESTINATION, ALL_DESCRIPTION);

const getOffers = (pointType, points) => {
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

const generatePointsWithOffers = (points) => {
  const pointsWithOffers = {};

  Object.keys(ALL_POINT_ACTION).forEach((point) => {
    Object.assign(pointsWithOffers, {
      [point]: getOffers(point, points)
    });
  });

  return pointsWithOffers;
};

// Когда данные будут приходить с сервера - эта константа переедет в point-edit
const pointsActionWithOffers = generatePointsWithOffers(ACTIONS_WITH_OFFERS);

const isFutureDate = (nowDate, startDate) => startDate > nowDate;

const isPastDate = (nowDate, endDate) => endDate < nowDate;

export {getPointDurationInDHM, getPointDurationInMs, castDateTimeFormat, formatDate, formatTime, generateRandomArrayFromAnother, generateRandomArrayItem, getRandomEndDate, getRandomIntegerNumber, getRandomStartDate, isFutureDate, isPastDate, pointsActionWithOffers, POINTS_DESTINATION_WITH_DESCRIPTION};

