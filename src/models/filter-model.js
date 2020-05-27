export default class FilterModel {
  constructor(activeFilterType) {
    this._activeFilterType = activeFilterType;

    this._activeFilterTypeChangeObservers = [];
    this._availableFiltersChangeObservers = [];
    this._availableFilters = [];

    this._callAvailableFiltersChangeObservers = this._callAvailableFiltersChangeObservers.bind(this);
    this.setAvailableFilters = this.setAvailableFilters.bind(this);
  }

  setPointsModel(pointsModel) {
    pointsModel.setFiltersWithPossiblePointsChangeObserver(this.setAvailableFilters);
  }

  getActiveFilterType() {
    return this._activeFilterType;
  }

  setActiveFilterType(filterType, changePropertyType) {
    this._activeFilterType = filterType;
    this._activeFilterTypeChangeObservers.forEach((handler) => handler(this._activeFilterType, changePropertyType));
  }

  setAvailableFilters(availableFilters) {
    this._availableFilters = availableFilters;
    this._callAvailableFiltersChangeObservers(availableFilters);
  }

  getAvailableFilters() {
    return this._availableFilters;
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
