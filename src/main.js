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
import {castDateTimeFormat} from "./utils.js";

const EVENT_COUNT = 23;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

const filters = generateFilters();
const allEvents = generateDayEvents(EVENT_COUNT);
const eventDays = allEvents.map((it) => [`${it.eventStartDate.getFullYear()}-${castDateTimeFormat(it.eventStartDate.getMonth())}-${castDateTimeFormat(it.eventStartDate.getDate())}`].join(`, `));

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(), `beforeend`);

render(tripMenuElement, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate(filters), `beforeend`);

render(tripEventsElement, createSortingTemplate(), `beforeend`);
render(tripEventsElement, createEventEditTemplate(), `beforeend`);


render(tripEventsElement, createTripDaysTemplate(eventDays), `beforeend`);

const tripDaysElement = tripEventsElement.querySelectorAll(`.trip-days__item`);

tripDaysElement.forEach((day) => {
  const tripEventsOfDayElement = day.querySelector(`.trip-events__list`);
  const tripDay = day.querySelector(`.day__date`).getAttribute(`dateTime`);

  const tripDate = tripDay.slice(8, 10);
  const tripMonth = tripDay.slice(5, 7);

  allEvents.forEach((eventItem) => {
    const eventDate = castDateTimeFormat(eventItem.eventStartDate.getDate());
    const eventMonth = castDateTimeFormat(eventItem.eventStartDate.getMonth());

    if (tripMonth === eventMonth && tripDate === eventDate) {
      render(tripEventsOfDayElement, createDayEventTemplate(eventItem), `beforeend`);
    }
  });

});
