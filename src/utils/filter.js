import {FilterType} from "../const";
import {isFutureDate, isPastDate} from "./common.js";


const getFuturePoints = (points, date) => {
  return points.filter((point) => {
    const startDate = point.startDate;

    return isFutureDate(date, startDate);
  });
};

const getPastPoints = (points, date) => {
  return points.filter((point) => {
    const endDate = point.endDate;

    return isPastDate(date, endDate);
  });
};

/**
 * @return {*} Функция, котоаря возвращает компоненты точек маршрута по заданному фильтру
 * @param {*} points Массив с компонентами "Точка маршрута"
 * @param {*} filterType Тип фильтра
 */
export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }

  return points;
};
