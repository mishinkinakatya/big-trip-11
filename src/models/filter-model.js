export default class FilterModel {
  constructor(activeFilterType) {
    this._activeFilterType = activeFilterType;

    this._activeFilterTypeChangeObservers = [];
    this._availableFiltersChangeObservers = [];
    this._availableFilters = [];

    this._callAvailableFiltersChangeObservers = this._callAvailableFiltersChangeObservers.bind(this);
    this.setAvailableFilters = this.setAvailableFilters.bind(this);
  }

  getActiveFilterType() {
    return this._activeFilterType;
  }

  getAvailableFilters() {
    return this._availableFilters;
  }

  setActiveFilterType(filterType, changePropertyType) {
    this._activeFilterType = filterType;
    this._activeFilterTypeChangeObservers.forEach((handler) => handler(this._activeFilterType, changePropertyType));
  }

  setAvailableFilters(availableFilters) {
    this._availableFilters = availableFilters;
    this._callAvailableFiltersChangeObservers(availableFilters);
  }

  setPointsModel(pointsModel) {
    pointsModel.setFiltersWithPossiblePointsChangeObserver(this.setAvailableFilters);
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
