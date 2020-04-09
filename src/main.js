import {createDayEventElement} from "./components/day-event.js";
import {createEventEditElement} from "./components/event-edit.js";
import {createFilterElement} from "./components/filter.js";
import {createSiteMenuElement} from "./components/site-menu.js";
import {createSortingElement} from "./components/sorting.js";
import {createTripCostElement} from "./components/trip-cost.js";
import {createTripDayElement} from "./components/trip-day.js";
import {createTripInfoElement} from "./components/trip-info.js";
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

render(tripMainElement, createTripInfoElement(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostElement(), `beforeend`);

render(tripMenuElement, createSiteMenuElement(), `afterend`);
render(tripControlsElement, createFilterElement(filters), `beforeend`);

render(tripEventsElement, createSortingElement(), `beforeend`);
render(tripEventsElement, createEventEditElement(), `beforeend`);

render(tripEventsElement, createTripDayElement(), `beforeend`);

const tripEventsOfDayElement = tripEventsElement.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripEventsOfDayElement, createDayEventElement(), `beforeend`);
}
