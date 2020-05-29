import {deepCopy} from "./utils/common.js";

export default class DataStorage {
  constructor() {
    this._allDestinations = [];
    this._allOffers = [];
  }

  getAllDestinations() {
    return this._allDestinations.map((it) => deepCopy(it));
  }

  getAllOffers() {
    return this._allOffers.map((it) => deepCopy(it));
  }

  setAllDestination(data) {
    this._allDestinations = data;
  }

  setAllOffers(data) {
    this._allOffers = data;
  }

  isDestinations() {
    return this._allDestinations.length !== 0 ? true : false;
  }

  isOffers() {
    return this._allOffers.length !== 0 ? true : false;
  }
}
