import EventOfDayComponent from "../components/event-of-day.js";
import EventEditComponent from "../components/event-edit.js";
import NoEventsComponent from "../components/no-events.js";
import SortComponent, {SortType} from "../components/sort.js";
import TripDayComponent from "../components/trip-day.js";
import TripDaysComponent, {clearContent} from "../components/trip-days.js";
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

const renderEventToDays = (daysOfEvents, tripDays, container, events) => {
  const uniqueSortDays = Array.from(new Set(daysOfEvents)).sort();

  uniqueSortDays.map((it, i) => {
    render(tripDays, new TripDayComponent(i + 1, it), RenderPosition.BEFOREEND);
  });

  const tripDaysElement = container.querySelectorAll(`.trip-days__item`);

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

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
  }

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

    renderEventToDays(eventDays, tripDays.getElement(), this._container, events);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(events, sortType);

      clearContent(tripDays);

      if (sortType !== SortType.EVENT) {
        const tripDayComponent = new TripDayComponent(``, ``);
        render(tripDays.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

        const tripList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
        sortedEvents.forEach((eventItem) => {
          renderEvent(tripList, eventItem);
        });
      }

      if (sortType === SortType.EVENT) {
        renderEventToDays(eventDays, tripDays.getElement(), this._container, sortedEvents);
      }
    });
  }
}
