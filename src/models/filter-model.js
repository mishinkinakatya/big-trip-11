export default class FilterModel {
  constructor(activeFilterType) {
    this._activeFilterType = activeFilterType;
    this._activeFilterTypeChangeObservers = [];
  }

  getActiveFilterType() {
    return this._activeFilterType;
  }

  setActiveFilterType(filterType) {
    this._activeFilterType = filterType;
    this._activeFilterTypeChangeObservers.forEach((handler) => handler(this._activeFilterType));
  }

  setActiveFilterTypeChangeObserver(handler) {
    this._activeFilterTypeChangeObservers.push(handler);
  }
}
