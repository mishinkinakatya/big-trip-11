export default class SortModel {
  constructor(activeSortType) {
    this._activeSortType = activeSortType;
    this._activeSortTypeChangeObservers = [];
  }

  getActiveSortType() {
    return this._activeSortType;
  }

  setActiveSortType(sortType) {
    this._activeSortType = sortType;
    this._activeSortTypeChangeObservers.forEach((handler) => handler(this._activeSortType));
  }

  setActiveSortTypeChangeObserver(handler) {
    this._activeSortTypeChangeObservers.push(handler);
  }
}
