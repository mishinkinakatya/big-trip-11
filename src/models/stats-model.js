import {ALL_POINT_ACTION, POINT_TRANSPORT} from "../const.js";
import {getPointDurationInDHM} from "../utils/common.js";


export default class StatsModel {
  constructor(pointsModel) {
    this._pointsModel = pointsModel;
    this._pointsSortedOnDays = this._getPointsSortedOnDays();


    this._statsChangeObservers = [];

    this._moneyStats = this._getMoneyStats();
    this._transportStats = this._getTransportStats();
    this._timeSpendStats = this._getTimeSpendStats();

    this._changeStats = this._changeStats.bind(this);
    pointsModel.setActualPointsControllersChangeObserver(this._changeStats);
  }

  setStatsChangeObserver(handler) {
    this._statsChangeObservers.push(handler);
  }

  _getPointsSortedOnDays() {
    return this._pointsModel.getPointsControllersSortedOnDays().map((pointController) => pointController.getModel().getActualPoint());
  }

  _changeStats() {
console.log(this._pointsSortedOnDays);
    this._pointsSortedOnDays = this._getPointsSortedOnDays();

    this._moneyStats = this._getMoneyStats();
    this._transportStats = this._getTransportStats();
    this._timeSpendStats = this._getTimeSpendStats();
console.log(this._moneyStats);
console.log(this._transportStats);
console.log(this._timeSpendStats);
    this._callStatsChangeObservers();
  }

  _getMoneyStats() {
    if (this._pointsSortedOnDays.length === 0) {
      return 0;
    }

    return Object.keys(ALL_POINT_ACTION).map((action) => {
      const allPricesForCurrentAction = this._pointsSortedOnDays.filter((point) => point.type === action).map((point) => point.price);
      return {
        [action]: allPricesForCurrentAction.length > 0 ? allPricesForCurrentAction.reduce((acc, pointPrice) => acc + pointPrice) : 0,
      };
    });
  }

  _getTransportStats() {
    if (this._pointsSortedOnDays.length === 0) {
      return 0;
    }

    return Object.keys(POINT_TRANSPORT).map((transport) => {
      return {
        [transport]: this._pointsSortedOnDays.filter((point) => point.type === transport).length,
      };
    });
  }

  _getTimeSpendStats() {
    if (this._pointsSortedOnDays.length === 0) {
      return `00M`;
    }

    return Object.keys(ALL_POINT_ACTION).map((action) => {
      const allDurationsForCurrentAction = this._pointsSortedOnDays.filter((point) => point.type === action).map((point) => point.durationInMs);
      return {
        [action]: allDurationsForCurrentAction.length > 0 ? getPointDurationInDHM(allDurationsForCurrentAction.reduce((acc, pointDuration) => acc + pointDuration)) : `00M`,
      };
    });
  }

  _callStatsChangeObservers() {
    this._statsChangeObservers.forEach((handler) => handler(this._moneyStats, this._transportStats, this._timeSpendStats));
  }
}
