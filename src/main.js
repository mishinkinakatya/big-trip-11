import DayEventComponent from "./components/events-of-day.js";
import EventEditComponent from "./components/event-edit.js";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import SortComponent from "./components/sort.js";
import TripCostComponent from "./components/trip-cost.js";
import TripDaysComponent from "./components/trip-days.js";
import TripInfoComponent from "./components/trip-info.js";
import {generateDayEvents} from "./mock/event-of-trip.js";
import {generateFilters} from "./mock/filter.js";
import {castDateTimeFormat, render, RenderPosition} from "./utils.js";

const EVENT_COUNT = 23;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

const filters = generateFilters();

render(tripMainElement, new TripInfoComponent().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent().getElement(), RenderPosition.BEFOREEND);

render(tripMenuElement, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);

render(tripControlsElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

render(tripEventsElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const allEvents = generateDayEvents(EVENT_COUNT);
const eventDays = allEvents.map((it) => [`${it.startDate.getFullYear()}-${castDateTimeFormat(it.startDate.getMonth())}-${castDateTimeFormat(it.startDate.getDate())}`].join(`, `));

const renderEvent = (eventListElement, event) => {
  const onEditButtonClick = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), dayEventComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    eventListElement.replaceChild(dayEventComponent.getElement(), eventEditComponent.getElement());
  };

  const dayEventComponent = new DayEventComponent(event);
  const editButton = dayEventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const eventEditComponent = new EventEditComponent(event);
  const editForm = eventEditComponent.getElement();
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(eventListElement, dayEventComponent.getElement(), RenderPosition.BEFOREEND);
};

render(tripEventsElement, new TripDaysComponent(eventDays).getElement(), RenderPosition.BEFOREEND);

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
