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
    if (this._pointsSortedOnDays.length === 0) {
      return 0;
    }

    const actionsCost = {};
    Object.keys(ALL_POINT_ACTION).forEach((action) => {
      const allPricesForCurrentAction = this._pointsSortedOnDays.filter((point) => point.type === action).map((point) => point.price);

      const costOfCurrentAction = allPricesForCurrentAction.length > 0 ? allPricesForCurrentAction.reduce((acc, pointPrice) => acc + pointPrice) : 0;

      return costOfCurrentAction !== 0
        ? Object.assign(actionsCost, {
          [action]: costOfCurrentAction,
        })
        : Object.assign(actionsCost);
    });

    return actionsCost;
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
    if (this._pointsSortedOnDays.length === 0) {
      return 0;
    }

    const actionsTimeSpend = {};
    Object.keys(ALL_POINT_ACTION).forEach((action) => {
      const allDurationsForCurrentAction = this._pointsSortedOnDays.filter((point) => point.type === action).map((point) => point.durationInMs);

      const timeSpendOfCurrentAction = allDurationsForCurrentAction.length > 0 ? allDurationsForCurrentAction.reduce((acc, pointDuration) => acc + pointDuration) : 0;

      return timeSpendOfCurrentAction !== 0
        ? Object.assign(actionsTimeSpend, {
          [action]: timeSpendOfCurrentAction,
        })
        : Object.assign(actionsTimeSpend);
    });

    return actionsTimeSpend;
  }
}
