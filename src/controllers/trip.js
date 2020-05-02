import PointOfDayComponent from "../components/point-of-day.js";
import PointEditComponent from "../components/point-edit.js";
import NoPointsComponent from "../components/no-points.js";
import SortComponent, {SortType} from "../components/sort.js";
import DayOfTripComponent from "../components/day-of-trip.js";
import TripDaysComponent from "../components/trip-days.js";
import {castDateTimeFormat} from "../utils/common.js";
import {render, replace, RenderPosition} from "../utils/render.js";

/**
 * Функция для рендеринга одной точки маршрута
 * @param {*} pointListElement Элемент, внутри которого нужно отрисовать точку маршрута
 * @param {*} point Объект с описанием свойств точки маршрута
 */
const renderPoint = (pointListElement, point) => {
  /** Функция, которая заменяет Точку маршрута в режиме Default, на Точку маршрута в режиме Edit */
  const replacePointToEdit = () => {
    replace(pointEditComponent, pointOfDayComponent);
  };

  /** Функция, которая заменяет Точку маршрута в режиме Edit, на Точку маршрута в режиме Default */
  const replaceEditToPoint = () => {
    replace(pointOfDayComponent, pointEditComponent);
  };

  /** Метод, который устанавливает колбэк на нажатие кнопки Esc
   * @param {*} evt Событие, которое произошло
   */
  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      replaceEditToPoint();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  /** Инстанс компонента "Одна точка маршрута" */
  const pointOfDayComponent = new PointOfDayComponent(point);
  pointOfDayComponent.setEditButtonClickHandler(() => {
    replacePointToEdit();
    document.addEventListener(`keydown`, escKeyDownHandler);
  });

  /** Инстанс компонента "Точка маршрута в режиме Edit" */
  const pointEditComponent = new PointEditComponent(point);
  pointEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToPoint();
    document.removeEventListener(`keydown`, escKeyDownHandler);
  });

  render(pointListElement, pointOfDayComponent, RenderPosition.BEFOREEND);
};

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
   * @param {*} container Компонент, внутри которого будет рендериться маршрут путешествия
   */
  constructor(container) {
    this._container = container;

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
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

    const tripDays = new TripDaysComponent();
    render(this._container, tripDays, RenderPosition.BEFOREEND);

    renderPointsToDays(pointsDays, tripDays.getElement(), points);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedPoints(points, sortType);

      tripDays.clearContent();

      if (sortType !== SortType.EVENT) {
        const tripDayComponent = new DayOfTripComponent(``, ``);
        render(tripDays.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

        const tripList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
        sortedEvents.forEach((eventItem) => {
          renderPoint(tripList, eventItem);
        });
      }

      if (sortType === SortType.EVENT) {
        renderPointsToDays(pointsDays, tripDays.getElement(), sortedEvents);
      }
    });
  }
}
