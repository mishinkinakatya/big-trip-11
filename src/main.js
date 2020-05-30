import FilterController from "./controllers/filter-controller.js";
import FilterModel from "./models/filter-model.js";
import LoadingComponent from "./components/loading.js";
import NoPointsComponent from "./components/no-points.js";
import PointController from "./controllers/point-controller.js";
import PointsController from "./controllers/points-controller.js";
import PointModel from "./models/point-model.js";
import PointsModel from "./models/points-model.js";
import SiteMenuComponent from "./components/site-menu.js";
import SortController from "./controllers/sort-controller.js";
import SortModel from "./models/sort-model.js";
import StatsController from "./controllers/stats-controller.js";
import StatsModel from "./models/stats-model.js";
import TripInfoController from "./controllers/trip-info-controller.js";
import TripInfoModel from "./models/trip-info-model.js";
import {ChangePropertyType, FilterType, PointMode, SortType, MenuItem} from "./const.js";
import {convertToClientModel} from "./utils/model-adapter.js";
import {getDataManager} from "./data-manager-provider.js";
import {getStorage} from "./storage-provider.js";
import {render, remove, RenderPosition} from "./utils/render.js";

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);
const tripPointsElement = document.querySelector(`.trip-events`);
const statsContainer = document.querySelector(`main .page-body__container`);
const addButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const dataManager = getDataManager();
const storage = getStorage();

// init
const loadingComponent = new LoadingComponent();
const noPointsComponent = new NoPointsComponent();

const filterModel = new FilterModel(FilterType.EVERYTHING);
const filterController = new FilterController(tripControlsElement, filterModel);

const sortModel = new SortModel(SortType.EVENT);
const sortController = new SortController(tripPointsElement, sortModel);

const pointsModel = new PointsModel(sortModel, filterModel);
const pointsController = new PointsController(tripPointsElement, pointsModel);

filterModel.setPointsModel(pointsModel);

const tripInfoModel = new TripInfoModel(pointsModel);
const tripInfoController = new TripInfoController(tripMainElement, tripInfoModel);

const statsModel = new StatsModel(pointsModel);
const statsController = new StatsController(statsContainer, statsModel);

const siteMenuComponent = new SiteMenuComponent();

// render
render(tripPointsElement, loadingComponent, RenderPosition.BEFOREEND);
addButton.disabled = true;
tripInfoController.render();
render(tripMenuElement, siteMenuComponent, RenderPosition.AFTEREND);
filterController.render();

Promise.all([
  dataManager.getDestinations(),
  dataManager.getOffers(),
  dataManager.getPoints()
])
  .then((results) => {
    remove(loadingComponent);
    addButton.disabled = false;
    storage.setAllDestination(results[0]);

    storage.setAllOffers(results[1]);
    const truePoints = results[2].map((it) => {
      return convertToClientModel(it);
    }).filter((it) => it !== null);

    const pointsControllers = truePoints.map((it) => {
      return new PointController(new PointModel(it, it, PointMode.DEFAULT));
    });

    if (pointsControllers.length === 0) {
      render(tripPointsElement, noPointsComponent, RenderPosition.BEFOREEND);
    } else {
      sortController.render();
      pointsController.render();
      pointsModel.setPoints(pointsControllers);
    }
  })
  .catch(() => {
    remove(loadingComponent);
    addButton.disabled = false;
    render(tripPointsElement, noPointsComponent, RenderPosition.BEFOREEND);
  });

// menu
siteMenuComponent.setMenuItemChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statsController.remove();
      pointsController.show();
      filterController.restoreFilters();
      addButton.disabled = false;
      break;
    case MenuItem.STATS:
      pointsModel.resetAllPoints(pointsModel.getActualPoints());
      pointsController.hide();
      statsController.activate();
      filterController.forceDisabled();
      addButton.disabled = true;
      break;
  }
});

// button New event
const setDisabledForAddButton = () => {
  addButton.disabled = pointsModel.getActualPoints().find((point) => {
    return point.getModel().getMode() === PointMode.ADDING;
  });
};

pointsModel.setActualPointsControllersChangeObserver(setDisabledForAddButton);

addButton.addEventListener(`click`, () => {
  if (noPointsComponent) {
    remove(noPointsComponent);
  }
  filterModel.setActiveFilterType(FilterType.EVERYTHING, ChangePropertyType.FROM_MODEL);
  sortModel.setActiveSortType(SortType.EVENT, ChangePropertyType.FROM_MODEL);
  pointsModel.createPoint();
  setDisabledForAddButton();
});

// sync
window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  dataManager.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

