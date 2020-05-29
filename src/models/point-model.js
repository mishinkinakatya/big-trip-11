import {PointMode} from "../const.js";
import {deepCopy} from "../utils/common.js";

export default class PointModel {
  constructor(point, tempPoint, mode) {
    this._point = point === null ? null : Object.assign({}, point);
    this._tempPoint = Object.assign({}, tempPoint);
    this._mode = mode ? mode : PointMode.DEFAULT;

    this._modeChangeObservers = [];
    this._pointDataChangeObservers = [];
    this._removePointObservers = [];
  }

  getActualPoint() {
    return this._point === null ? this.getTempPoint() : Object.assign({}, this._point);
  }

  getTempPoint() {
    return deepCopy(this._tempPoint);
  }

  getMode() {
    return this._mode;
  }

  setMode(mode, changePropertyType) {
    if (this._mode === mode) {
      return;
    }
    this._mode = mode;
    this._modeChangeObservers.forEach((handler) => handler(this, changePropertyType));
  }

  applyChanges() {
    this._point = Object.assign({}, this._tempPoint);
  }

  removePoint() {
    this._removePointObservers.forEach((handler) => handler(this));
  }

  resetChanges() {
    this._tempPoint = Object.assign({}, this._point);
  }

  updateTempPoint(point) {
    this._tempPoint = Object.assign({}, point);
  }

  isInit() {
    return this._point !== null;
  }

  setModeChangeObserver(handler) {
    this._modeChangeObservers.push(handler);
  }

  setPointDataChangeObserver(handler) {
    this._pointDataChangeObservers.push(handler);
  }

  setRemovePointObserver(handler) {
    this._removePointObservers.push(handler);
  }
}
