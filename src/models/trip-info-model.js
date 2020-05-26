import moment from "moment";

export default class TripInfoModel {
  constructor(pointsModel) {
    this._pointsModel = pointsModel;
    this._pointsSortedOnDays = this._getPointsSortedOnDays();

    this._tripInfoChangeObservers = [];

    this._tripInfo = {
      title: this._getTripTitle(),
      dates: this._getTripDates(),
      cost: this._getTripCost(),
    };

    this._changeTripInfo = this._changeTripInfo.bind(this);
    pointsModel.setActualPointsControllersChangeObserver(this._changeTripInfo);
  }

  setTripInfoChangeObserver(handler) {
    this._tripInfoChangeObservers.push(handler);
  }

  _getPointsSortedOnDays() {
    return this._pointsModel.getPointsControllersSortedOnDays().map((pointController) => pointController.getModel().getActualPoint());
  }

  _getTripTitle() {
    if (this._pointsSortedOnDays.length === 0) {
      return ``;
    }
    const allPointsDestinations = this._pointsSortedOnDays.map((point) => point.destination);
    const uniquePointsDestinations = Array.from(new Set(allPointsDestinations));

    return uniquePointsDestinations.length > 3
      ? `${allPointsDestinations[0]} — ... — ${allPointsDestinations[allPointsDestinations.length - 1]}`
      : uniquePointsDestinations.join(` — `);
  }

  _getTripDates() {
    if (this._pointsSortedOnDays.length === 0) {
      return ``;
    }
    const startDate = this._pointsSortedOnDays[0].startDate;
    const endDate = this._pointsSortedOnDays[this._pointsSortedOnDays.length - 1].endDate;

    return moment(startDate).month() === moment(endDate).month()
      ? `${moment(startDate).format(`MMM`)}  ${moment(startDate).format(`DD`)} — ${moment(endDate).format(`DD`)}`
      : `${moment(startDate).format(`DD MMM`)} — ${moment(endDate).format(`DD MMM`)}`;
  }

  _getTripCost() {
    if (this._pointsSortedOnDays.length === 0) {
      return 0;
    }
    const allPointsPrices = this._pointsSortedOnDays.map((point) => {
      const checkedOffers = point.offers ? point.offers.filter((offer) => offer.isChecked).map((offer) => Number(offer.price)) : ``;
      let offersPrice = 0;
      if (checkedOffers.length > 0) {
        offersPrice = checkedOffers.reduce((acc, price) => Number(acc) + Number(price));
      }

      return Number(point.price) + offersPrice;
    });

    return allPointsPrices.reduce((acc, pointPrice) => acc + pointPrice);
  }

  _changeTripInfo() {
    this._pointsSortedOnDays = this._getPointsSortedOnDays();

    this._tripInfo.title = this._getTripTitle();
    this._tripInfo.dates = this._getTripDates();
    this._tripInfo.cost = this._getTripCost();

    this._callTripInfoChangeObservers();
  }

  _callTripInfoChangeObservers() {
    this._tripInfoChangeObservers.forEach((handler) => handler(this._tripInfo));
  }
}
