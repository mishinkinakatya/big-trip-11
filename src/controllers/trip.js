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
 * Функция для отрисовки событий, сгруппированным по дням
 * @param {*} daysOfPoints Массив с о всеми днями событий
 * @param {*} tripDays Элемент, внутри которого будет рендериться блок с днями событий
 * @param {*} points Массив всех событий
 */
const renderPointsToDays = (daysOfPoints, tripDays, points) => {
  const uniqueSortDays = Array.from(new Set(daysOfPoints)).sort();

  uniqueSortDays.map((it, i) => {
    render(tripDays, new DayOfTripComponent(i + 1, it), RenderPosition.BEFOREEND);
  });

  const tripDaysElement = tripDays.querySelectorAll(`.trip-days__item`);

  tripDaysElement.forEach((day) => {
    const tripPointsOfDayElement = day.querySelector(`.trip-events__list`);
    const tripDay = day.querySelector(`.day__date`).getAttribute(`dateTime`);

    const tripDate = tripDay.slice(8, 10);
    const tripMonth = tripDay.slice(5, 7);

    points.forEach((pointItem) => {
      const pointDate = castDateTimeFormat(pointItem.startDate.getDate());
      const pointMonth = castDateTimeFormat(pointItem.startDate.getMonth());

      if (tripMonth === pointMonth && tripDate === pointDate) {
        renderPoint(tripPointsOfDayElement, pointItem);
      }
    });
  });
};

/** Контроллер: "Маршрут путешествия" */
export default class TripController {
  /**
   * Свойства контроллера "Маршрут путешествия"
   * @property {*} this._container - Компонент, внутри которого будет рендериться маршрут путешествия
   * @property {*} this._noPointsComponent - Компонент, который будет рендериться, если нет ни одной точки маршрута
   * @property {*} this._sortComponent - Компонент "Сортировка"
   * @property {*} this._tripDays - Компонент "Блок с днями путешествия"
   * @param {*} container Компонент, внутри которого будет рендериться маршрут путешествия
   */
  constructor(container) {
    this._container = container;

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._tripDays = new TripDaysComponent();
  }

  /**
   * Метод для рендеринга всех точек маршрута
   * @param {array} points Массив со всеми точками маршрута
   */
  render(points) {
    const isPoints = points.length === 0;

    if (isPoints) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    const pointsDays = points.map((it) => [`${it.startDate.getFullYear()}-${castDateTimeFormat(it.startDate.getMonth())}-${castDateTimeFormat(it.startDate.getDate())}`].join(`, `));

    render(this._container, this._tripDays, RenderPosition.BEFOREEND);

    renderPointsToDays(pointsDays, this._tripDays.getElement(), points);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedPoints(points, sortType);

      this._tripDays.clearContent();

      if (sortType !== SortType.EVENT) {
        const tripDayComponent = new DayOfTripComponent(``, ``);
        render(this._tripDays.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

        const tripList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
        sortedEvents.forEach((eventItem) => {
          renderPoint(tripList, eventItem);
        });
      }

      if (sortType === SortType.EVENT) {
        renderPointsToDays(pointsDays, this._tripDays.getElement(), sortedEvents);
      }
    });
  }
}
