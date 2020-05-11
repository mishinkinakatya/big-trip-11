export default class PointModel {
  constructor(point) {
    this._point = point;
    this._tempPoint = point;

    this._pointDataChangeObservers = [];
    // this._id = point.id;
    // this._description = point.description;
    // this._destination = point.destination;
    // this._duration = point.duration;
    // this._durationInMs = point.durationInMs;
    // this._endDate = point.endDate;
    // this._isFavorite = point.isFavorite;
    // this._offers = point.offers;
    // this._photos = point.photos;
    // this._price = point.price;
    // this._startDate = point.startDate;
    // this._type = point.type;
    // this._typeWithPreposition = point.typeWithPreposition;
  }

  getActualPoint() {
    return this._point;
  }

  getTempPoint() {
    return this._tempPoint;
  }

  resetChanges() {
    this._tempPoint = this._point;
  }

  applyChanges() {
    this._point = this._tempPoint;
    this._pointDataChangeObservers.forEach((handler) => handler(this));
  }

  updateTempPoint(point) {
    this._tempPoint = point;
  }

  setPointDataChangeObserver(handler) {
    this._pointDataChangeObservers.push(handler);
  }
}
