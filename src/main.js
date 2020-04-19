import TripController from "./controllers/trip.js";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import TripInfoComponent from "./components/trip-info.js";
import {generateDayEvents} from "./mock/event-of-trip.js";
import {generateFilters} from "./mock/filter.js";
import {render, RenderPosition} from "./utils/render.js";

const EVENT_COUNT = 23;

const tripMainElement = document.querySelector(`.trip-main`);

render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);
const tripInfoElement = document.querySelector(`.trip-info`);

render(tripInfoElement, new TripCostComponent(), RenderPosition.BEFOREEND);
render(tripMenuElement, new SiteMenuComponent(), RenderPosition.AFTEREND);

const filters = generateFilters();

render(tripControlsElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const allEvents = generateDayEvents(EVENT_COUNT);
const tripEventsElement = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEventsElement);
tripController.render(allEvents);
