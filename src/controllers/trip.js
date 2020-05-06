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
   * @property {*} this._viewChangeHandler - Приватный метод - колбэк, который уведомляет все подписанные на него контроллеры, что они должны изменить вид (переключает в дефолтный режим все контроллеры "Точка маршрута")
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
    const isPoints = this._points.length === 0;

    if (isPoints) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    render(this._container, this._tripDays, RenderPosition.BEFOREEND);
    const newPoints = this._renderPointsToDays(this._getPointsDays(), this._points);
    this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }

  /** @return {*} Приватный метод, который возвращает все даты путешествия */
  _getPointsDays() {
    return this._points.map((it) => [`${it.startDate.getFullYear()}-${castDateTimeFormat(it.startDate.getMonth())}-${castDateTimeFormat(it.startDate.getDate())}`].join(`, `));
  }

  /**
 * @return {*} Приватный метод для отрисовки точек маршрута без группировки по дням
 * @param {*} tripList Элемент, внутри которого будут рендериться точки маршрута
 * @param {*} point Массив всех точек маршрута
 */
  _renderPoint(tripList, point) {
    const pointController = new PointController(tripList, this._dataChangeHandler, this._viewChangeHandler);
    pointController.render(point);

    return pointController;
  }

  /**
   * @return {*} Приватный метод, который возвращает все дни маршрута и отрисовывает их
   * @param {*} daysOfPoints Массив с о всеми днями точек маршрута
   */
  _renderDaysOfTrip(daysOfPoints) {
    const uniqueSortDays = Array.from(new Set(daysOfPoints)).sort();
    if (uniqueSortDays.lenght !== 0) {
      uniqueSortDays.map((it, i) => {
        render(this._tripDays.getElement(), new DayOfTripComponent(i + 1, it), RenderPosition.BEFOREEND);
      });
    } else {
      render(this._tripDays.getElement(), new DayOfTripComponent(``, ``), RenderPosition.BEFOREEND);
    }

    if (daysOfPoints) {
      return this._tripDays.getElement().querySelectorAll(`.trip-days__item`);
    } else {
      return this._tripDays.getElement().querySelectorAll(`.trip-events__list`);
    }
  }

  /**
   * @return {*} Приватный метод для отрисовки точек маршрута, сгруппированных по дням
   * @param {*} daysOfPoints Массив с о всеми днями точек маршрута
   * @param {*} points Массив всех точек маршрута
   */
  _renderPointsToDays(daysOfPoints, points) {
    let newPoints = [];

    if (daysOfPoints === null) {
      this._renderDaysOfTrip(daysOfPoints);
      render(this._tripDays.getElement(), new DayOfTripComponent(``, ``), RenderPosition.BEFOREEND);

      newPoints = points.map((point) => {
        return this._renderPoint(this._tripDays.getElement().querySelector(`.trip-events__list`), point);
      });
    } else {
      const allTripDays = this._renderDaysOfTrip(daysOfPoints);

      allTripDays.forEach((day) => {
        const tripPointsOfDayElement = day.querySelector(`.trip-events__list`);
        const tripDay = day.querySelector(`.day__date`).getAttribute(`dateTime`);

        const tripDate = tripDay.slice(8, 10);
        const tripMonth = tripDay.slice(5, 7);

        let newItems = points.filter((point) => {
          const pointDate = castDateTimeFormat(point.startDate.getDate());
          const pointMonth = castDateTimeFormat(point.startDate.getMonth());

          return tripMonth === pointMonth && tripDate === pointDate;
        }).map((point) => {
          return this._renderPoint(tripPointsOfDayElement, point);
        });

        newPoints = newPoints.concat(newItems);
      });
    }

    return newPoints;
  }

  /**
   * Приватный метод - колбэк для клика по типу сортировки (перерисовывает точки маршрута при изменении типа сортировки)
   * @param {*} sortType Тип сортировки
   */
  _sortTypeChangeHandler(sortType) {
    const sortedPoints = getSortedPoints(this._points, sortType);
    this._tripDays.clearContent();
    let newPoints = [];

    if (sortType !== SortType.EVENT) {
      newPoints = this._renderPointsToDays(null, sortedPoints);
    }

    if (sortType === SortType.EVENT) {
      newPoints = this._renderPointsToDays(this._getPointsDays(), sortedPoints);
    }

    this._showedPointControllers = newPoints;
  }

  /**
   * Приватный метод - колбэк, который изменяет данные (клик по звёздочке (Favorite))
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

  /** Приватный метод - колбэк, который уведомляет все подписанные на него контроллеры, что они должны изменить вид (переключает в дефолтный режим все контроллеры "Точка маршрута") */
  _viewChangeHandler() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }
}
