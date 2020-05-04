import {castDateTimeFormat} from "../utils/common.js";
import DayOfTripComponent from "../components/day-of-trip.js";
import NoPointsComponent from "../components/no-points.js";
import PointController from "../controllers/point.js";
import SortComponent, {SortType} from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import {render, RenderPosition} from "../utils/render.js";

/**
 * @return {*} Функция, котороя возвращает отсортированный массив событий
 * @param {array} points Массив событий
 * @param {string} sortType Тип сортировки
 */
const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  const showingPoints = points.slice();

  switch (sortType) {
    case SortType.TIME:
      sortedPoints = showingPoints.sort((a, b) => b.durationInMs - a.durationInMs);
      break;
    case SortType.PRICE:
      sortedPoints = showingPoints.sort((a, b) => b.price - a.price);
      break;
    case SortType.EVENT:
      sortedPoints = showingPoints;
      break;
  }

  return sortedPoints;
};

/**
 * @return {*} Функция для отрисовки точек маршрута без группировки по дням
 * @param {*} tripList Элемент, внутри которого будут рендериться точки маршрута
 * @param {*} point Массив всех точек маршрута
 * @param {*} dataChangeHandler Метод, который измененяет данные и перерисовывает компонент
 * @param {*} viewChangeHandler
 */
const renderPoint = (tripList, point, dataChangeHandler, viewChangeHandler) => {
  const pointController = new PointController(tripList, dataChangeHandler, viewChangeHandler);
  pointController.render(point);

  return pointController;
};
// const renderPoints = (tripList, points, dataChangeHandler, viewChangeHandler) => {
//   return points.map((point) => {
//     const pointController = new PointController(tripList, dataChangeHandler, viewChangeHandler);

//     pointController.render(point);

//     return pointController;
//   });
// };

/**
 * @return {*} Функция, которая возвращает все дни маршрута и отрисовывает их
 * @param {*} daysOfPoints Массив с о всеми днями точек маршрута
 * @param {*} tripDaysElement Элемент, внутри которого будет рендериться блок с днями точек маршрута
 */
const renderDaysOfTrip = (daysOfPoints, tripDaysElement) => {
  const uniqueSortDays = Array.from(new Set(daysOfPoints)).sort();
  if (uniqueSortDays.lenght !== 0) {
    uniqueSortDays.map((it, i) => {
      render(tripDaysElement, new DayOfTripComponent(i + 1, it), RenderPosition.BEFOREEND);
    });
  } else {
    render(tripDaysElement, new DayOfTripComponent(``, ``), RenderPosition.BEFOREEND);
  }

  if (daysOfPoints) {
    return tripDaysElement.querySelectorAll(`.trip-days__item`);
  } else {
    return tripDaysElement.querySelectorAll(`.trip-events__list`);
  }
};

// const tripDayComponent = new DayOfTripComponent(``, ``);
// render(this._tripDays.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

/**
 * @return {*} Функция для отрисовки точек маршрута, сгруппированным по дням
 * @param {*} daysOfPoints Массив с о всеми днями точек маршрута
 * @param {*} tripDaysElement Элемент, внутри которого будет рендериться блок с днями точек маршрута
 * @param {*} points Массив всех точек маршрута
 * @param {*} dataChangeHandler Метод, который измененяет данные и перерисовывает компонент
 * @param {*} viewChangeHandler
 */
// const renderPointsToDays = (daysOfPoints, tripDaysElement, points, dataChangeHandler, viewChangeHandler) => {

//   const allTripDays = renderDaysOfTrip(daysOfPoints, tripDaysElement);

//   return allTripDays.forEach((day) => {
//     const tripPointsOfDayElement = day.querySelector(`.trip-events__list`);
//     const tripDay = day.querySelector(`.day__date`).getAttribute(`dateTime`);

//     const tripDate = tripDay.slice(8, 10);
//     const tripMonth = tripDay.slice(5, 7);

//     return points.map((point) => {
//       const pointController = new PointController(tripPointsOfDayElement, dataChangeHandler, viewChangeHandler);

//       const pointDate = castDateTimeFormat(point.startDate.getDate());
//       const pointMonth = castDateTimeFormat(point.startDate.getMonth());

//       if (tripMonth === pointMonth && tripDate === pointDate) {
//         pointController.render(point);
//       }
//       return pointController;
//     });
//   });
// };

const renderPointsToDays = (daysOfPoints, tripDaysElement, points, dataChangeHandler, viewChangeHandler) => {
  // какой-то код из оригинальной функции
  const allTripDays = renderDaysOfTrip(daysOfPoints, tripDaysElement);

  let newPoints = [];

  allTripDays.forEach((day) => {
    // какой-то код из оригинальной функции
    const tripPointsOfDayElement = day.querySelector(`.trip-events__list`);
    const tripDay = day.querySelector(`.day__date`).getAttribute(`dateTime`);

    const tripDate = tripDay.slice(8, 10);
    const tripMonth = tripDay.slice(5, 7);

    let newItems = points.filter((point) => {
      /* реализация этой логики */
      const pointDate = castDateTimeFormat(point.startDate.getDate());
      const pointMonth = castDateTimeFormat(point.startDate.getMonth());

      return tripMonth === pointMonth && tripDate === pointDate;
      /**/
    }).map((point) => { // Тут будет renderPoints() и она вернет в newPoints контроллеры
      return renderPoint(tripPointsOfDayElement, point, dataChangeHandler, viewChangeHandler);
    });

    newPoints = newPoints.concat(newItems);
  });

  return newPoints;
};

/** Контроллер: "Маршрут путешествия" */
export default class TripController {
  /**
   * Свойства контроллера "Маршрут путешествия"
   * @property {*} this._container - Компонент, внутри которого будет рендериться маршрут путешествия
   * @property {*} this._points - Массив со всеми точками маршрута
   * @property {*} this._showedPointControllers - Массив со всеми показанынми контроллерами "Точка маршрута"
   * @property {*} this._noPointsComponent - Компонент, который будет рендериться, если нет ни одной точки маршрута
   * @property {*} this._sortComponent - Компонент "Сортировка"
   * @property {*} this._tripDays - Компонент "Блок с днями путешествия"
   * @property {*} this._dataChangeHandler - Метод, который измененяет данные и перерисовывает компонент
   * @property {*} this._viewChangeHandler
   * @property {*} this._sortTypeChangeHandler - Приватный метод - колбэк для клика по типу сортировки (перерисовывает точки маршрута при изменении типа сортировки)
   * @property {*} this._getPointsDays - Приватный метод, который возвращает все даты путешествия
   * @param {*} container Компонент, внутри которого будет рендериться маршрут путешествия
   */
  constructor(container) {
    this._container = container;

    this._points = [];
    this._showedPointControllers = [];
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._tripDays = new TripDaysComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);

    this._getPointsDays = this._getPointsDays.bind(this);
  }

  /**
   * Метод для рендеринга всех точек маршрута
   * @param {array} points Массив со всеми точками маршрута
   */
  render(points) {
    this._points = points;
    const pointsDays = this._getPointsDays(this._points);
    const isPoints = this._points.length === 0;

    if (isPoints) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    render(this._container, this._tripDays, RenderPosition.BEFOREEND);
    const newPoints = renderPointsToDays(pointsDays, this._tripDays.getElement(), this._points, this._dataChangeHandler, this._viewChangeHandler);
    this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }

  /** @return {*} Приватный метод, который возвращает все даты путешествия */
  _getPointsDays() {
    return this._points.map((it) => [`${it.startDate.getFullYear()}-${castDateTimeFormat(it.startDate.getMonth())}-${castDateTimeFormat(it.startDate.getDate())}`].join(`, `));
  }

  /**
   * Приватный метод - колбэк для клика по типу сортировки (перерисовывает точки маршрута при изменении типа сортировки)
   * @param {*} sortType Тип сортировки
   */
  _sortTypeChangeHandler(sortType) {
    const sortedPoints = getSortedPoints(this._points, sortType);
    const pointsDays = this._getPointsDays(this._points);
    this._tripDays.clearContent();
    let newPoints = [];

    if (sortType !== SortType.EVENT) {
      // const tripDayComponent = new DayOfTripComponent(``, ``);
      // render(this._tripDays.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

      // const tripList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
      // newPoints = renderPoints(tripList, sortedPoints, this._dataChangeHandler, this._viewChangeHandler);
      const withoutDays = [];
      newPoints = renderPointsToDays(withoutDays, this._tripDays.getElement(), sortedPoints, this._dataChangeHandler, this._viewChangeHandler);
    }

    if (sortType === SortType.EVENT) {
      newPoints = renderPointsToDays(pointsDays, this._tripDays.getElement(), sortedPoints, this._dataChangeHandler, this._viewChangeHandler);
    }

    this._showedPointControllers = newPoints;
  }

  /**
   * Приватный метод - колбэк для клика по звёздочке (Favorite)
   * @param {*} pointController Контроллер точки маршрута
   * @param {*} oldData Старые данные
   * @param {*} newData Новые данные
   */
  _dataChangeHandler(pointController, oldData, newData) {
    const index = this._points.findIndex((it) => it === oldData);
    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));

    pointController.render(this._points[index]);
  }

  _viewChangeHandler() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }
}
