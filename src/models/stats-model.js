import {ALL_POINT_ACTION, POINT_TRANSPORT} from "../const.js";

export default class StatsModel {
  constructor(pointsModel) {
    this._pointsModel = pointsModel;
    this._pointsSortedOnDays = this._getPointsSortedOnDays();

    this._moneyStats = this._getMoneyStats();
    this._transportStats = this._getTransportStats();
    this._timeSpendStats = this._getTimeSpendStats();
  }

  getActualStats() {
    this._pointsSortedOnDays = this._getPointsSortedOnDays();

    this._moneyStats = this._getMoneyStats();
    this._transportStats = this._getTransportStats();
    this._timeSpendStats = this._getTimeSpendStats();

    return {
      moneyStats: this._moneyStats,
      transportStats: this._transportStats,
      timeSpendStats: this._timeSpendStats,
    };
  }

  _getPointsSortedOnDays() {
    return this._pointsModel.getPointsControllersSortedOnDays().map((pointController) => pointController.getModel().getActualPoint());
  }

  _getMoneyStats() {
    return this._calculateValue(`price`);
  }

  _getTransportStats() {
    if (this._pointsSortedOnDays.length === 0) {
      return 0;
    }

    const transportsCount = {};
    Object.keys(POINT_TRANSPORT).forEach((transport) => {
      const countOfCurrentTransport = this._pointsSortedOnDays.filter((point) => point.type === transport).length;

      return countOfCurrentTransport !== 0
        ? Object.assign(transportsCount, {
          [transport]: countOfCurrentTransport,
        })
        : Object.assign(transportsCount);
    });

    return transportsCount;
  }

  _getTimeSpendStats() {
    return this._calculateValue(`durationInMs`);
  }

  _calculateValue(property) {
    if (this._pointsSortedOnDays.length === 0) {
      return 0;
    }

    const propertyValues = {};
    Object.keys(ALL_POINT_ACTION).forEach((action) => {
      const allValuesForCurrentAction = this._pointsSortedOnDays.filter((point) => point.type === action).map((point) => point[property]);

      const valueOfCurrentAction = allValuesForCurrentAction.length > 0 ? allValuesForCurrentAction.reduce((acc, value) => acc + value) : 0;

      return valueOfCurrentAction !== 0
        ? Object.assign(propertyValues, {
          [action]: valueOfCurrentAction,
        })
        : Object.assign(propertyValues);
    });

    return propertyValues;
  }
}
