import PointsModel from "./models/points-model.js";
import SiteMenuComponent from "./components/site-menu.js";
import TripCostComponent from "./components/trip-cost.js";
import TripInfoComponent from "./components/trip-info.js";
import {generatePointsOfTrip} from "./mock/points-of-trip.js";
import {render, RenderPosition} from "./utils/render.js";
import PointController from "./controllers/point-controller.js";
import PointsController from "./controllers/points-controller.js";
import SortModel from "./models/sort-model.js";
import {SortType, FilterType} from "./const.js";
import SortController from "./controllers/sort-controller.js";
import FilterModel from "./models/filter-model.js";
import FilterController from "./controllers/filter-controller.js";

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

// Фильтры
const filterModel = new FilterModel(FilterType.EVERYTHING);
const filterController = new FilterController(tripControlsElement, filterModel);
filterController.render();

// Сортировка
const sortModel = new SortModel(SortType.EVENT);
const sortController = new SortController(tripPointsElement, sortModel);
sortController.render();

/** Инстанс модели "Точки маршрута" */
const pointsModel = new PointsModel();
const pointsControllers = allPoints.map((it) => new PointController(it));
pointsModel.setPoints(pointsControllers);
const pointsController = new PointsController(tripPointsElement, pointsModel);
pointsController.render();

/** Инстанс контроллера "Маршрут путешествия" */
// const tripController = new TripController(tripPointsElement, pointsModel);
// tripController.render();

// const addButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
// addButton.addEventListener(`click`, () => {
//   // addButton.disabled = true;
//   tripController.createPoint();
// });
