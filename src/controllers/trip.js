import {castDateTimeFormat} from "../utils/common.js";
import DayOfTripComponent from "../components/day-of-trip.js";
import TripWithoutDaysComponent from "../components/trip-without-days.js";
import NoPointsComponent from "../components/no-points.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point.js";
import SortComponent, {SortType} from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import {render, remove, RenderPosition} from "../utils/render.js";

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
   * @property {*} this._pointsModel - Модель задач "Точки маршрута"
   * @property {*} this._showedPointControllers - Массив со всеми показанынми контроллерами "Точка маршрута"
   * @property {*} this._noPointsComponent - Компонент, который будет рендериться, если нет ни одной точки маршрута
   * @property {*} this._sortComponent - Компонент "Сортировка"
   * @property {*} this._tripDays - Компонент "Блок с днями путешествия"
   * @property {*} this._dataChangeHandler - Метод, который измененяет данные и перерисовывает компонент
   * @property {*} this._viewChangeHandler - Приватный метод - колбэк, который уведомляет все подписанные на него контроллеры, что они должны изменить вид (переключает в дефолтный режим все контроллеры "Точка маршрута")
   * @property {*} this._sortTypeChangeHandler - Приватный метод - колбэк для клика по типу сортировки (перерисовывает точки маршрута при изменении типа сортировки)
   * @property {*} this._filterChangeHandler - Приватный метод - колбэк для клика по типу фильтра (перерисовывает точки маршрута при изменении типа фильтра)
   * @property {*} this._getPointsDays - Приватный метод, который возвращает все даты путешествия
   * @param {*} container Компонент, внутри которого будет рендериться маршрут путешествия
   * @param {*} pointsModel Модель задач "Точки маршрута"
   */
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._showedPointControllers = [];
    this._daysOfTrip = [];

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._tripDays = new TripDaysComponent();
    this._tripWithoutDays = new TripWithoutDaysComponent();

    this._creatingPoint = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    this._pointsModel.setFilterChangeHandler(this._filterChangeHandler);
    this._pointsModel.setDataChangeHandler(this._dataChangeHandler);

    this._getPointsDays = this._getPointsDays.bind(this);
  }

  /**
   * Метод для рендеринга всех точек маршрута
   * @param {array} points Массив со всеми точками маршрута
   */
  render() {
    const points = this._pointsModel.getPoints();
    const isPoints = points.length === 0;

    if (isPoints) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._tripDays, RenderPosition.BEFOREEND);

    const daysOfTrip = this._renderDaysOfTrip(this._getPointsDays());
    this._daysOfTrip = this._daysOfTrip.concat(daysOfTrip);

    const newPoints = this._renderPointsToDays(points);
    this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }

  /** Метод для создания и отрисовки нового компонента Точка маршрута */
  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    // this._viewChangeHandler();
    this._creatingPoint = new PointController(this._tripDays.getElement(), this._dataChangeHandler, this._viewChangeHandler);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  /** @return {*} Приватный метод, который возвращает все даты путешествия */
  _getPointsDays() {
    return this._pointsModel.getPoints().map((it) => [`${it.startDate.getFullYear()}-${castDateTimeFormat(it.startDate.getMonth())}-${castDateTimeFormat(it.startDate.getDate())}`].join(`, `));
  }

  /**
 * @return {*} Приватный метод для отрисовки точек маршрута без группировки по дням
 * @param {*} tripList Элемент, внутри которого будут рендериться точки маршрута
 * @param {*} point Массив всех точек маршрута
 */
  _renderPoint(tripList, point) {
    const pointController = new PointController(tripList, this._dataChangeHandler, this._viewChangeHandler);
    pointController.render(point, PointControllerMode.DEFAULT);

    return pointController;
  }

  /**
    * @return {*} Приватный метод, который возвращает все контроллеры "Один день маршрута" и отрисовывает их
    * @param {*} daysOfPoints Массив с о всеми днями точек маршрута
    */
  _renderDaysOfTrip(daysOfPoints) {
    const daysOfTrip = [];
    const uniqueSortDays = Array.from(new Set(daysOfPoints)).sort();
    uniqueSortDays.map((it, i) => {
      const dayOfTrip = new DayOfTripComponent(i + 1, it);
      render(this._tripDays.getElement(), dayOfTrip, RenderPosition.BEFOREEND);
      daysOfTrip.push(dayOfTrip);
    });
    return daysOfTrip;
  }

  /** @return {*} Приватный метод, который возвращает контроллер "Маршрут без разделения по дням" и рендерит его */
  _renderTripWithoutDays() {
    render(this._tripDays.getElement(), this._tripWithoutDays, RenderPosition.BEFOREEND);
    return [this._tripWithoutDays];
  }

  /**
   * @return {*} Приватный метод для отрисовки точек маршрута, сгруппированных по дням
   * @param {*} points Массив всех точек маршрута
   */
  _renderPointsToDays(points) {
    let newPoints = [];

    if (this._daysOfTrip.includes(this._tripWithoutDays)) {
      newPoints = points.map((point) => {
        return this._renderPoint(this._tripDays.getElement().querySelector(`.trip-events__list`), point);
      });
    } else {
      this._daysOfTrip.forEach((day) => {
        const tripPointsOfDayElement = day.getElement().querySelector(`.trip-events__list`);
        const tripDay = day.getElement().querySelector(`.day__date`).getAttribute(`dateTime`);
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

  _removeDaysOfTrip() {
    this._daysOfTrip.forEach((dayOfTripController) => remove(dayOfTripController));
    this._daysOfTrip = [];
  }

  _removePoints() {
    this._showedPointControllers.forEach((pointController) => pointController.destroy());
    this._showedPointControllers = [];
  }

  _updatePoints() {
    this._removeDaysOfTrip();
    this._removePoints();
    this._daysOfTrip = this._renderDaysOfTrip(this._getPointsDays());
    this._renderPointsToDays(this._pointsModel.getPoints());
  }


  _filterChangeHandler() {
    this._updatePoints();
  }

  /**
   * Приватный метод - колбэк для клика по типу сортировки (перерисовывает точки маршрута при изменении типа сортировки)
   * @param {*} sortType Тип сортировки
   */
  _sortTypeChangeHandler(sortType) {
    const points = this._pointsModel.getPoints();

    const sortedPoints = getSortedPoints(points, sortType);
    this._removeDaysOfTrip();
    let newPoints = [];

    if (sortType !== SortType.EVENT) {
      this._daysOfTrip = this._renderTripWithoutDays();
      newPoints = this._renderPointsToDays(sortedPoints);
    }

    if (sortType === SortType.EVENT) {
      this._daysOfTrip = this._renderDaysOfTrip(this._getPointsDays());
      newPoints = this._renderPointsToDays(sortedPoints);
    }

    this._showedPointControllers = newPoints;
  }

  /**
   * Приватный метод - колбэк, который изменяет данные
   * @param {*} pointController Контроллер точки маршрута
   * @param {*} oldData Старые данные
   * @param {*} newData Новые данные
   */
  _dataChangeHandler(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      // Добавление Точки маршрута
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);

        this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
      }
    } else if (newData === null) {
      // Удаление Точки маршрута
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      // Обновление Точки маршрута
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  /** Приватный метод - колбэк, который уведомляет все подписанные на него контроллеры, что они должны изменить вид (переключает в дефолтный режим все контроллеры "Точка маршрута") */
  _viewChangeHandler() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }
}
