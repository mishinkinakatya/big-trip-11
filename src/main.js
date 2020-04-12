import {createDayEventTemplate} from "./components/day-event.js";
import {createEventEditTemplate} from "./components/event-edit.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createTripDaysTemplate} from "./components/trip-day.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {generateDayEvents} from "./mock/event.js";
import {generateFilters} from "./mock/filter.js";

const EVENT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

const filters = generateFilters();
const dayEvents = generateDayEvents(EVENT_COUNT);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(), `beforeend`);

render(tripMenuElement, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate(filters), `beforeend`);

render(tripEventsElement, createSortingTemplate(), `beforeend`);
render(tripEventsElement, createEventEditTemplate(), `beforeend`);

render(tripEventsElement, createTripDaysTemplate(), `beforeend`);

const tripEventsOfDayElement = tripEventsElement.querySelector(`.trip-events__list`);

for (let i = 0; i < dayEvents.length; i++) {
  render(tripEventsOfDayElement, createDayEventTemplate(dayEvents[i]), `beforeend`);
}
