import EventOfDayComponent from "../components/event-of-day.js";
import EventEditComponent from "../components/event-edit.js";
import NoEventsComponent from "../components/no-events.js";
import SortComponent from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import {castDateTimeFormat} from "../utils/common.js";
import {render, replace, RenderPosition} from "../utils/render.js";

const renderEvent = (eventListElement, event) => {
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventOfDayComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventOfDayComponent, eventEditComponent);
  };

  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  const eventOfDayComponent = new EventOfDayComponent(event);
  eventOfDayComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, escKeyDownHandler);
  });

  const eventEditComponent = new EventEditComponent(event);
  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, escKeyDownHandler);
  });

  render(eventListElement, eventOfDayComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
  }

  render(events) {
    const isEvents = events.every((event) => event.type && event.destination && event.startDate && event.endDate && event.price);

    if (!isEvents) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    const eventDays = events.map((it) => [`${it.startDate.getFullYear()}-${castDateTimeFormat(it.startDate.getMonth())}-${castDateTimeFormat(it.startDate.getDate())}`].join(`, `));

    render(this._container, new TripDaysComponent(eventDays), RenderPosition.BEFOREEND);

    const tripDaysElement = this._container.querySelectorAll(`.trip-days__item`);

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
  }
}
