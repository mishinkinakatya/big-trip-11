export default class SortModel {
  constructor(activeSortType) {
    this._activeSortType = activeSortType;
    this._activeSortTypeChangeObservers = [];
  }

  getActiveSortType() {
    return this._activeSortType;
  }

  setActiveSortType(sortType, changePropertyType) {
    this._activeSortType = sortType;
    this._activeSortTypeChangeObservers.forEach((handler) => handler(changePropertyType));
  }

  setActiveSortTypeChangeObserver(handler) {
    this._activeSortTypeChangeObservers.push(handler);
  }
}
