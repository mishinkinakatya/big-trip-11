import moment from "moment";

export default class TripInfoModel {
  constructor(pointsModel) {
    this._pointsModel = pointsModel;
    this._pointsSortedOnDays = this._getPointsSortedOnDays();


    this._tripInfoChangeObservers = [];

    this._tripInfo = {
      title: this._getTripTitle(),
      dates: this._getTripDates(),
      coast: this._getTripCoast(),
    };

    this._changeTripInfo = this._changeTripInfo.bind(this);
    this._getPointsSortedOnDays = this._getPointsSortedOnDays.bind(this);
    this._getTripTitle = this._getTripTitle.bind(this);
    this._getTripDates = this._getTripDates.bind(this);
    this._getTripCoast = this._getTripCoast.bind(this);
    this._callTripInfoChangeObservers = this._callTripInfoChangeObservers.bind(this);

    pointsModel.setActualPointsControllersChangeObserver(this._changeTripInfo);
  }

  getTripInfo() {
    return this._tripInfo;
  }

  setTripInfoChangeObserver(handler) {
    this._tripInfoChangeObservers.push(handler);
  }

  _getPointsSortedOnDays() {
    return this._pointsModel.getPointsControllersSortedOnDays().map((pointController) => pointController.getModel().getActualPoint());
  }

  _changeTripInfo() {
    this._pointsSortedOnDays = this._getPointsSortedOnDays();

    this._tripInfo.title = this._getTripTitle();
    this._tripInfo.dates = this._getTripDates();
    this._tripInfo.coast = this._getTripCoast();

    this._callTripInfoChangeObservers();
  }

  _getTripTitle() {
    if (this._pointsSortedOnDays.length === 0) {
      return ``;
    }
    const allPointsDestinations = this._pointsSortedOnDays.map((point) => point.destination);
    const uniquePointsDestinations = Array.from(new Set(allPointsDestinations));

    if (uniquePointsDestinations.length > 3) {
      return `${allPointsDestinations[0]} — ... — ${allPointsDestinations[allPointsDestinations.length - 1]}`;
    } else {
      return uniquePointsDestinations.join(` — `);
    }
  }

  _getTripDates() {
    if (this._pointsSortedOnDays.length === 0) {
      return ``;
    }
    const startDate = this._pointsSortedOnDays[0].startDate;
    const endDate = this._pointsSortedOnDays[this._pointsSortedOnDays.length - 1].endDate;

    if (moment(startDate).month() === moment(endDate).month()) {
      return `${moment(startDate).format(`MMM`)}  ${moment(startDate).format(`DD`)} — ${moment(endDate).format(`DD`)}`;
    } else {
      return `${moment(startDate).format(`DD MMM`)} — ${moment(endDate).format(`DD MMM`)}`;
    }
  }

  _getTripCoast() {
    if (this._pointsSortedOnDays.length === 0) {
      return ``;
    }
    const allPointsPrices = this._pointsSortedOnDays.map((point) => {
      const pointPrice = Number(point.price);
      const checkedOffers = point.offers.filter((offer) => offer.isChecked).map((offer) => Number(offer.price));
      let offersPrice = 0;
      if (checkedOffers.length > 0) {
        offersPrice = checkedOffers.reduce((acc, price) => Number(price));
      }
      const resultPrice = pointPrice + offersPrice;
      return resultPrice;
    });

    return allPointsPrices.reduce((acc, pointPrice) => acc + pointPrice);
  }

  _callTripInfoChangeObservers() {
    this._tripInfoChangeObservers.forEach((handler) => handler(this._tripInfo));
  }
}
