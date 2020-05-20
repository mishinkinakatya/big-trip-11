import {FilterType} from "../const";
import {isFutureDate, isPastDate} from "./common.js";


const getFuturePoints = (points, date) => {
  return points.filter((point) => isFutureDate(date, point.getModel().getActualPoint().startDate));
};

const getPastPoints = (points, date) => {
  return points.filter((point) => isPastDate(date, point.getModel().getActualPoint().endDate));
};

/**
 * @param {array} points Массив с компонентами "Точка маршрута"
 * @param {string} filterType Тип фильтра
 * @return {*} Функция, котоаря возвращает компоненты точек маршрута по заданному фильтру
 */
export const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points, new Date());
    case FilterType.PAST:
      return getPastPoints(points, new Date());
    default:
      throw new Error(`Filter type is invalid`);
  }
};
