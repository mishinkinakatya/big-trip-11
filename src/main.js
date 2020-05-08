import TripController from "./controllers/trip.js";
import FilterController from "./controllers/filter.js";
import PointsModel from "./models/points.js";
import SiteMenuComponent from "./components/site-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import TripInfoComponent from "./components/trip-info.js";
import {generatePointsOfTrip} from "./mock/points-of-trip.js";
import {render, RenderPosition} from "./utils/render.js";

const POINTS_COUNT = 7;
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

/** Массив всех точек маршрута */
const allPoints = generatePointsOfTrip(POINTS_COUNT);
/** Элемент, внутри которого будет рендериться Маршрут путешествия */
const tripPointsElement = document.querySelector(`.trip-events`);

/** Инстанс модели "Точки маршрута" */
const pointsModel = new PointsModel();
pointsModel.setPoints(allPoints);

/** Инстанс контроллера "Фильтрация" */
const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

/** Инстанс контроллера "Маршрут путешествия" */
const tripController = new TripController(tripPointsElement, pointsModel);
tripController.render();

const addButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addButton.addEventListener(`click`, () => {
  // addButton.disabled = true;
  tripController.createPoint();
});
