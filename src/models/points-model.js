import PointController from "../controllers/point-controller.js";
import PointModel from "./point-model.js";
import {getPointsByFilter} from "../utils/filter.js";
import {ChangePropertyType, FilterType, PointMode, SortType} from "../const.js";
import {getStorage} from "../storage-provider.js";

const getEmptyPoint = (offers) => {
  return {
    description: ``,
    destination: ``,
    duration: `00M`,
    endDate: new Date(),
    isFavorite: false,
    offers,
    photos: null,
    price: ``,
    startDate: new Date(),
    type: `bus`,
    typeWithPreposition: `Bus to`,
  };
};

export default class PointsModel {
  constructor(sortModel, filterModel) {
    // models
    this._sortModel = sortModel;
    this._filterModel = filterModel;
    this._allPointsControllers = [];
    this._actualPointsControllers = [];
    this._filtersWithPossiblePoints = [];

    // Observers
    this._filtersWithPossiblePointsObservers = [];
    this._actualPointsControllersChangeObservers = [];

    // set observes
    this._sortModel.setActiveSortTypeChangeObserver((changePropertyType) => {
      if (changePropertyType === ChangePropertyType.FROM_VIEW) {
        this._resetAllPoints(this._allPointsControllers);
        this._updateActualPoints();
      }
    });
    this._filterModel.setActiveFilterTypeChangeObserver((_, changePropertyType) => {
      if (changePropertyType === ChangePropertyType.FROM_VIEW) {
        this._resetAllPoints(this._allPointsControllers);
        this._updateActualPoints();
      }
    });

    // binds
    this._removePoint = this._removePoint.bind(this);
    this._updateActualPointsBeforeChangeMode = this._updateActualPointsBeforeChangeMode.bind(this);
  }

  getActualPoints() {
    return this._actualPointsControllers;
  }

  getPointsControllersSortedOnDays() {
    return this._applySort(this._allPointsControllers, SortType.EVENT);
  }

  /**
   * Метод, который записывает точки маршрута
   * @param {*} points Массив точек маршрута
   */
  setPoints(points) {
    this._allPointsControllers = Array.from(points);
    this._allPointsControllers.forEach((pointController) => {
      pointController.getModel().setModeChangeObserver(this._updateActualPointsBeforeChangeMode);
      pointController.getModel().setRemovePointObserver(this._removePoint);
    });
    this._updateActualPoints();
  }

  createPoint() {
    const offers = getStorage().getAllOffers().find((item) => item.type === `bus`) ? getStorage().getAllOffers().find((item) => item.type === `bus`).offers : ``;
    const emptyPoint = Object.assign({}, getEmptyPoint(offers));
    const pointModel = new PointModel(null, emptyPoint, PointMode.ADDING);
    pointModel.setModeChangeObserver(this._updateActualPointsBeforeChangeMode);
    pointModel.setRemovePointObserver(this._removePoint);
    this._allPointsControllers = [].concat(new PointController(pointModel), this._allPointsControllers);
    this._updateActualPointsBeforeChangeMode(pointModel, ChangePropertyType.FROM_VIEW);
    this._updateActualPoints();
  }

  getActiveSortType() {
    return this._sortModel.getActiveSortType();
  }

  setActualPointsControllersChangeObserver(handler) {
    this._actualPointsControllersChangeObservers.push(handler);
  }

  setFiltersWithPossiblePointsChangeObserver(handler) {
    this._filtersWithPossiblePointsObservers.push(handler);
  }

  _applyFilter(activeFilterType) {
    return this._filtersWithPossiblePoints.find((it) => it.filterType === activeFilterType).points;
  }

  _applySort(pointsControllers, activeSortType) {
    switch (activeSortType) {
      case SortType.TIME:
        return pointsControllers.sort((a, b) => b.getModel().getActualPoint().durationInMs - a.getModel().getActualPoint().durationInMs);
      case SortType.PRICE:
        return pointsControllers.sort((a, b) => b.getModel().getActualPoint().price - a.getModel().getActualPoint().price);
      case SortType.EVENT:
        return pointsControllers.sort((a, b) => a.getModel().getActualPoint().startDate - b.getModel().getActualPoint().startDate);
      default:
        throw new Error(`Sort type is invalid`);
    }
  }

  _removePoint(pointModel) {
    this._allPointsControllers = this._allPointsControllers.filter((it) => it.getModel() !== pointModel);
    this._updateActualPoints();
  }

  _resetAllPoints(pointsControllers) {
    pointsControllers.forEach((pointController) => {
      const model = pointController.getModel();
      const mode = model.getMode();
      if (mode === PointMode.EDIT) {
        model.resetChanges();
        model.setMode(PointMode.DEFAULT, ChangePropertyType.FROM_MODEL);
      } else if (mode === PointMode.ADDING) {
        model.removePoint();
      }
    });
  }

  _setPossiblePointsForFilters(pointsControllers) {
    this._filtersWithPossiblePoints = Object.values(FilterType).map((filter) => {
      return {
        filterType: filter,
        points: getPointsByFilter(pointsControllers, filter),
      };
    });

    this._callFiltersWithPossiblePointsChangeObservers(this._filtersWithPossiblePointsObservers);
  }

  _updateActualPoints() {
    this._setPossiblePointsForFilters(this._allPointsControllers);
    const pointsControllersAfterFilter = this._applyFilter(this._filterModel.getActiveFilterType());
    const pointsControllersAfterFilterCopy = pointsControllersAfterFilter.slice();
    const pointsControllersAfterSorted = this._applySort(pointsControllersAfterFilterCopy, this._sortModel.getActiveSortType());
    this._actualPointsControllers = pointsControllersAfterSorted;
    this._callActualPointsControllersChangeObservers(this._actualPointsControllersChangeObservers);
  }

  _updateActualPointsBeforeChangeMode(pointModel, changePropertyType) {
    if (changePropertyType === ChangePropertyType.FROM_MODEL) {
      return;
    }
    const index = this._allPointsControllers.findIndex((it) => it.getModel() === pointModel);

    const notDefault = [].concat(this._allPointsControllers.slice(0, index), this._allPointsControllers.slice(index + 1)).filter((point) => {
      return point.getModel().getMode() !== PointMode.DEFAULT;
    });

    switch (pointModel.getMode()) {
      case PointMode.DEFAULT:
        this._updateActualPoints();
        break;
      case PointMode.EDIT:
      case PointMode.ADDING:
        this._resetAllPoints(notDefault);
        break;
    }
    this._callActualPointsControllersChangeObservers(this._actualPointsControllersChangeObservers);
  }

  _callActualPointsControllersChangeObservers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _callFiltersWithPossiblePointsChangeObservers(handlers) {
    const availableFilters = [];
    this._filtersWithPossiblePoints.forEach((it) => {
      if (it.points.length !== 0) {
        availableFilters.push(it.filterType);
      }
    });
    handlers.forEach((handler) => handler(availableFilters));
  }
}
