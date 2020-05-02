import TripController from "./controllers/trip.js";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import TripInfoComponent from "./components/trip-info.js";
import {generatePointsOfTrip} from "./mock/points-of-trip.js";
import {generateFilters} from "./mock/filter.js";
import {render, RenderPosition} from "./utils/render.js";

const POINTS_COUNT = 23;
/** Элемент, внутри которого будет рендериться вся страница */
const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

/** Элемент, внутри которого будет рендериться общая информация о путешествии и его стоимости */
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent(), RenderPosition.BEFOREEND);

/** Элемент, внутри которого будут рендериться компонеты "Меню" и "Фильтрация" */
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);

render(tripMenuElement, new SiteMenuComponent(), RenderPosition.AFTEREND);

/** Массив всех фильтров */
const filters = generateFilters();
render(tripControlsElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

/** Массив всех точек маршрута */
const allPoints = generatePointsOfTrip(POINTS_COUNT);
/** Элемент, внутри которого будет рендериться Маршрут путешествия */
const tripPointsElement = document.querySelector(`.trip-events`);

/** Инстанс контроллера "Маршрут путешествия" */
const tripController = new TripController(tripPointsElement);
tripController.render(allPoints);
