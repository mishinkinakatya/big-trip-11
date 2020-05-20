import FilterController from "./controllers/filter-controller.js";
import FilterModel from "./models/filter-model.js";
import NoPointsComponent from "./components/no-points.js";
import PointController from "./controllers/point-controller.js";
import PointsController from "./controllers/points-controller.js";
import PointsModel from "./models/points-model.js";
import SiteMenuComponent from "./components/site-menu.js";
import SortController from "./controllers/sort-controller.js";
import SortModel from "./models/sort-model.js";
import StatsController from "./controllers/stats-controller.js";
import StatsModel from "./models/stats-model.js";
import TripInfoController from "./controllers/trip-info-controller.js";
import TripInfoModel from "./models/trip-info-model.js";
import {generatePointsOfTrip} from "./mock/points-of-trip.js";
import {render, RenderPosition} from "./utils/render.js";
import {ChangePropertyType, FilterType, PointMode, SortType, MenuItem} from "./const.js";

const POINTS_COUNT = 3;
/** Элемент, внутри которого будет рендериться вся страница */
const tripMainElement = document.querySelector(`.trip-main`);

/** Элемент, внутри которого будут рендериться компонеты "Меню" и "Фильтрация" */
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);

/** Массив всех точек маршрута */
const allPoints = generatePointsOfTrip(POINTS_COUNT);
/** Элемент, внутри которого будет рендериться Маршрут путешествия */
const tripPointsElement = document.querySelector(`.trip-events`);

// Фильтры
const filterModel = new FilterModel(FilterType.EVERYTHING);
const filterController = new FilterController(tripControlsElement, filterModel);

// Сортировка
const sortModel = new SortModel(SortType.EVENT);
const sortController = new SortController(tripPointsElement, sortModel);

const pointsModel = new PointsModel(sortModel, filterModel);
const pointsControllers = allPoints.map((it) => new PointController(it));

filterModel.setPointsModel(pointsModel);
const pointsController = new PointsController(tripPointsElement, pointsModel);

const tripInfoModel = new TripInfoModel(pointsModel);
const tripInfoController = new TripInfoController(tripMainElement, tripInfoModel);

// Статистика
const statsModel = new StatsModel(pointsModel);
const statsController = new StatsController(tripPointsElement, statsModel);

const siteMenuComponent = new SiteMenuComponent();

// render
tripInfoController.render();
render(tripMenuElement, siteMenuComponent, RenderPosition.AFTEREND);
filterController.render();
if (pointsControllers.length === 0) {
  render(tripPointsElement, new NoPointsComponent(), RenderPosition.BEFOREEND);
} else {
  statsController.render();
  sortController.render();
  pointsController.render();
  pointsModel.setPoints(pointsControllers);
}

const setDisabledForAddButton = () => {
  addButton.disabled = pointsModel.getActualPoints().find((point) => {
    return point.getModel().getMode() === PointMode.ADDING;
  });
};

siteMenuComponent.setMenuItemChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statsController.hide();
      sortController.show();
      pointsController.show();
      break;
    case MenuItem.STATS:
      sortController.hide();
      pointsController.hide();
      statsController.show();
      break;
  }
});

pointsModel.setActualPointsControllersChangeObserver(setDisabledForAddButton);

const addButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addButton.addEventListener(`click`, () => {
  filterModel.setActiveFilterType(FilterType.EVERYTHING, ChangePropertyType.FROM_MODEL);
  sortModel.setActiveSortType(SortType.EVENT, ChangePropertyType.FROM_MODEL);
  pointsModel.createPoint();
  setDisabledForAddButton();
});

