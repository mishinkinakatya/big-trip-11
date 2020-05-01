import EventOfDayComponent from "../components/event-of-day.js";
import EventEditComponent from "../components/event-edit.js";
import NoEventsComponent from "../components/no-events.js";
import SortComponent, {SortType} from "../components/sort.js";
import DayOfTripComponent from "../components/day-of-trip.js";
import TripDaysComponent from "../components/trip-days.js";
import {castDateTimeFormat} from "../utils/common.js";
import {render, replace, RenderPosition} from "../utils/render.js";

/**
 * Функция для рендеринга одной точки маршрута
 * @param {*} eventListElement Элемент, внутри которого нужно отрисовать точку маршрута
 * @param {*} event Объект с описанием свойств точки маршрута
 */
const renderEvent = (eventListElement, event) => {
  /** Функция, которая заменяет Точку маршрута в режиме Default, на Точку маршрута в режиме Edit */
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventOfDayComponent);
  };

  /** Функция, которая заменяет Точку маршрута в режиме Edit, на Точку маршрута в режиме Default */
  const replaceEditToEvent = () => {
    replace(eventOfDayComponent, eventEditComponent);
  };

  /** Метод, который устанавливает колбэк на нажатие кнопки Esc
   * @param {*} evt Событие, которое произошло
   */
  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  /** Инстанс компонента "Одна точка маршрута" */
  const eventOfDayComponent = new EventOfDayComponent(event);
  eventOfDayComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, escKeyDownHandler);
  });

  /** Инстанс компонента "Точка маршрута в режиме Edit" */
  const eventEditComponent = new EventEditComponent(event);
  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, escKeyDownHandler);
  });

  render(eventListElement, eventOfDayComponent, RenderPosition.BEFOREEND);
};

/**
 * @return {*} Функция, котороя возвращает отсортированный массив событий
 * @param {array} events Массив событий
 * @param {string} sortType Тип сортировки
 */
const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const showingEvents = events.slice();

  switch (sortType) {
    case SortType.TIME:
      sortedEvents = showingEvents.sort((a, b) => b.durationInMs - a.durationInMs);
      break;
    case SortType.PRICE:
      sortedEvents = showingEvents.sort((a, b) => b.price - a.price);
      break;
    case SortType.EVENT:
      sortedEvents = showingEvents;
      break;
  }

  return sortedEvents;
};

/**
 * Функция для отрисовки событий, сгруппированным по дням
 * @param {*} daysOfEvents Массив с о всеми днями событий
 * @param {*} tripDays Элемент, внутри которого будет рендериться блок с днями событий
 * @param {*} events Массив всех событий
 */
const renderEventToDays = (daysOfEvents, tripDays, events) => {
  const uniqueSortDays = Array.from(new Set(daysOfEvents)).sort();

  uniqueSortDays.map((it, i) => {
    render(tripDays, new DayOfTripComponent(i + 1, it), RenderPosition.BEFOREEND);
  });

  const tripDaysElement = tripDays.querySelectorAll(`.trip-days__item`);

  tripDaysElement.forEach((day) => {
    const tripEventsOfDayElement = day.querySelector(`.trip-events__list`);
    const tripDay = day.querySelector(`.day__date`).getAttribute(`dateTime`);

    const tripDate = tripDay.slice(8, 10);
    const tripMonth = tripDay.slice(5, 7);

    events.forEach((eventItem) => {
      const eventDate = castDateTimeFormat(eventItem.startDate.getDate());
      const eventMonth = castDateTimeFormat(eventItem.startDate.getMonth());

      if (tripMonth === eventMonth && tripDate === eventDate) {
        renderEvent(tripEventsOfDayElement, eventItem);
      }
    });
  });
};

/** Контроллер: "Маршрут путешествия" */
export default class TripController {
  /**
   * Свойства контроллера "Маршрут путешествия"
   * @property {*} this._container - Компонент, внутри которого будет рендериться маршрут путешествия
   * @property {*} this._noEventsComponent - Компонент, который будет рендериться, если нет ни одной точки маршрута
   * @property {*} this._sortComponent - Компонент "Сортировка"
   * @param {*} container Компонент, внутри которого будет рендериться маршрут путешествия
   */
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
  }

  /**
   * Метод для рендеринга всех точек маршрута
   * @param {array} events Массив со всеми точками маршрута
   */
  render(events) {
    const isEvents = events.length === 0;

    if (isEvents) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    const eventDays = events.map((it) => [`${it.startDate.getFullYear()}-${castDateTimeFormat(it.startDate.getMonth())}-${castDateTimeFormat(it.startDate.getDate())}`].join(`, `));

    const tripDays = new TripDaysComponent();
    render(this._container, tripDays, RenderPosition.BEFOREEND);

    renderEventToDays(eventDays, tripDays.getElement(), events);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(events, sortType);

      tripDays.clearContent();

      if (sortType !== SortType.EVENT) {
        const tripDayComponent = new DayOfTripComponent(``, ``);
        render(tripDays.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

        const tripList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
        sortedEvents.forEach((eventItem) => {
          renderEvent(tripList, eventItem);
        });
      }

      if (sortType === SortType.EVENT) {
        renderEventToDays(eventDays, tripDays.getElement(), sortedEvents);
      }
    });
  }
}
