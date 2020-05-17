export default class FilterModel {
  constructor(activeFilterType) {
    this._activeFilterType = activeFilterType;

    this._activeFilterTypeChangeObservers = [];
    this._availableFiltersChangeObservers = [];

    this._callAvailableFiltersChangeObservers = this._callAvailableFiltersChangeObservers.bind(this);
  }

  getActiveFilterType() {
    return this._activeFilterType;
  }

  setActiveFilterType(filterType, changePropertyType) {
    this._activeFilterType = filterType;
    this._activeFilterTypeChangeObservers.forEach((handler) => handler(this._activeFilterType, changePropertyType));
  }

  setPointsModel(pointsModel) {
    pointsModel.setFiltersWithPossiblePointsChangeObserver(this._callAvailableFiltersChangeObservers);
  }

  setAvailableFiltersChangeObserver(handler) {
    this._availableFiltersChangeObservers.push(handler);
  }

  setActiveFilterTypeChangeObserver(handler) {
    this._activeFilterTypeChangeObservers.push(handler);
  }

  _callAvailableFiltersChangeObservers(filterTypes) {
    this._availableFiltersChangeObservers.forEach((handler) => handler(filterTypes));
  }
}
