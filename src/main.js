import FilterController from "./controllers/filter-controller.js";
import FilterModel from "./models/filter-model.js";
import LoadingComponent from "./components/loading.js";
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
import {render, remove, RenderPosition} from "./utils/render.js";
import {ChangePropertyType, FilterType, PointMode, SortType, MenuItem} from "./const.js";
import {convertToClientModel} from "./utils/model-adapter.js";
import PointModel from "./models/point-model.js";
import {getStorage} from "./storage-provider.js";
import {getApi} from "./api-provider.js";

const api = getApi();

/** Элемент, внутри которого будет рендериться вся страница */
const tripMainElement = document.querySelector(`.trip-main`);
/** Элемент, внутри которого будут рендериться компонеты "Меню" и "Фильтрация" */
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMenuElement = tripControlsElement.querySelector(`h2:first-child`);
/** Элемент, внутри которого будет рендериться Маршрут путешествия */
const tripPointsElement = document.querySelector(`.trip-events`);
/** Элемент, внутри которого будет рендериться Статистика */
const statsContainer = document.querySelector(`main .page-body__container`);

const noPointsComponent = new NoPointsComponent();
// Фильтры
const filterModel = new FilterModel(FilterType.EVERYTHING);
const filterController = new FilterController(tripControlsElement, filterModel);

// Сортировка
const sortModel = new SortModel(SortType.EVENT);
const sortController = new SortController(tripPointsElement, sortModel);

const pointsModel = new PointsModel(sortModel, filterModel);
const pointsController = new PointsController(tripPointsElement, pointsModel);
filterModel.setPointsModel(pointsModel);
const tripInfoModel = new TripInfoModel(pointsModel);
// Информация о путешествии
const tripInfoController = new TripInfoController(tripMainElement, tripInfoModel);
// Статистика
const statsModel = new StatsModel(pointsModel);
const statsController = new StatsController(statsContainer, statsModel);

const siteMenuComponent = new SiteMenuComponent();

const setDisabledForAddButton = () => {
  addButton.disabled = pointsModel.getActualPoints().find((point) => {
    return point.getModel().getMode() === PointMode.ADDING;
  });
};

pointsModel.setActualPointsControllersChangeObserver(setDisabledForAddButton);

const addButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addButton.addEventListener(`click`, () => {
  if (noPointsComponent) {
    remove(noPointsComponent);
  }
  filterModel.setActiveFilterType(FilterType.EVERYTHING, ChangePropertyType.FROM_MODEL);
  sortModel.setActiveSortType(SortType.EVENT, ChangePropertyType.FROM_MODEL);
  pointsModel.createPoint();
  setDisabledForAddButton();
});

siteMenuComponent.setMenuItemChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statsController.remove();
      pointsController.show();
      addButton.disabled = false;
      break;
    case MenuItem.STATS:
      pointsController.hide();
      statsController.activate();
      addButton.disabled = true;
      break;
  }
});

const loadingComponent = new LoadingComponent();
const storage = getStorage();
render(tripPointsElement, loadingComponent, RenderPosition.BEFOREEND);
addButton.disabled = true;
tripInfoController.render();
render(tripMenuElement, siteMenuComponent, RenderPosition.AFTEREND);
filterController.render();

Promise.all([
  api.getDestinations(),
  api.getOffers(),
  api.getPoints()
])
  .then((results) => {
    remove(loadingComponent);
    addButton.disabled = false;
    storage.setAllDestination(results[0]);

    storage.setAllOffers(results[1]);

    const pointsControllers = results[2].map((it) => {
      const model = convertToClientModel(it);
      return new PointController(new PointModel(model, model, PointMode.DEFAULT));
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
