import EventOfDayComponent from "./components/event-of-day.js";
import EventEditComponent from "./components/event-edit.js";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import SortComponent from "./components/sort.js";
import TripCostComponent from "./components/trip-cost.js";
import TripDaysComponent from "./components/trip-days.js";
import TripInfoComponent from "./components/trip-info.js";
import {generateDayEvents} from "./mock/event-of-trip.js";
import {generateFilters} from "./mock/filter.js";
import {castDateTimeFormat} from "./utils/common.js";
import {render, replace, RenderPosition} from "./utils/render.js";

const EVENT_COUNT = 23;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

const filters = generateFilters();

render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent(), RenderPosition.BEFOREEND);

render(tripMenuElement, new SiteMenuComponent(), RenderPosition.AFTEREND);

render(tripControlsElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

render(tripEventsElement, new SortComponent(), RenderPosition.BEFOREEND);

const allEvents = generateDayEvents(EVENT_COUNT);
const eventDays = allEvents.map((it) => [`${it.startDate.getFullYear()}-${castDateTimeFormat(it.startDate.getMonth())}-${castDateTimeFormat(it.startDate.getDate())}`].join(`, `));

const renderEvent = (eventListElement, event) => {
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventOfDayComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventOfDayComponent, eventEditComponent);
  };

  const eventOfDayComponent = new EventOfDayComponent(event);
  eventOfDayComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
  });

  const eventEditComponent = new EventEditComponent(event);
  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
  });

  render(eventListElement, eventOfDayComponent, RenderPosition.BEFOREEND);
};

render(tripEventsElement, new TripDaysComponent(eventDays), RenderPosition.BEFOREEND);

const tripDaysElement = tripEventsElement.querySelectorAll(`.trip-days__item`);

tripDaysElement.forEach((day) => {
  const tripEventsOfDayElement = day.querySelector(`.trip-events__list`);
  const tripDay = day.querySelector(`.day__date`).getAttribute(`dateTime`);

  const tripDate = tripDay.slice(8, 10);
  const tripMonth = tripDay.slice(5, 7);

  allEvents.forEach((eventItem) => {
    const eventDate = castDateTimeFormat(eventItem.startDate.getDate());
    const eventMonth = castDateTimeFormat(eventItem.startDate.getMonth());

    if (tripMonth === eventMonth && tripDate === eventDate) {
      renderEvent(tripEventsOfDayElement, eventItem);
    }
  });

});
