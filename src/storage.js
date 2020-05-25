export default class DataStorage {
  constructor() {
    this._allDestinations = [];
    this._allOffers = [];
  }

  // ------------------------------
  // ----- Запись в хранилище -----
  // ------------------------------
  setAllDestination(data) {
    this._allDestinations = data;
  }
  setAllOffers(data) {
    this._allOffers = data;
  }

  // ------------------------------
  // ----- Конвертации данных -----
  // ------------------------------

  // ------------------------------
  // ------ Получение данных ------
  // ------------------------------
  getAllDestinations() {
    return this._allDestinations;
  }

  getAllOffers() {
    return this._allOffers;
  }

  isDestinations() {
    return this._allDestinations.length !== 0 ? true : false;
  }

  isOffers() {
    return this._allOffers.length !== 0 ? true : false;
  }
}
