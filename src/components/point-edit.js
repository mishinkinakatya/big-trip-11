import AbstractSmartComponent from "./abstract-smart-component.js";
import {formatDateTime, POINT_WITH_OFFERS, addPreposition} from "../utils/common.js";
import {ALL_POINT_ACTION} from "../const.js";

/**
* @return {*} Функция, которая возвращает разметку блока "Тип точки маршрута"
* @param {*} pointType Тип точки маршрута
*/
const createPointTypeMarkup = (pointType) => {
  const type = (pointType === `check`) ? `check-in` : pointType;
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
    </div>`
  );
};

/**
* @return {*} Функция, которая возвращает разметку блока "Пункт назначения для точки маршрута"
* @param {*} pointDestination Пункт назначения
*/
const createDestinationMarkup = (pointDestination) => {
  return (
    `<option value="${pointDestination}"></option>`
  );
};

/**
  * @return {*} Функция, которая возвращает разметку блока "Дополнительные опции для точки маршрута"
  * @param {string} offer Дополнительные опция
  * @param {number} offerPrice Цена дополнительной опции
  * @param {boolean} isChecked Флаг: Опция выбрана?
  */
const createOfferMarkup = (offer, offerPrice, isChecked) => {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer}-1" type="checkbox" name="event-offer-${offer}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${offer}-1">
        <span class="event__offer-title">Add ${offer}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
      </label>
    </div>`
  );
};

/**
* @return {*} Функция, которая возвращает разметку блока "Фотография точки маршрута"
* @param {string} photo Src фотографии
*/
const createPhotosMarkup = (photo) => {
  return (
    `<img class="event__photo" src="${photo}" alt="Event photo"></img>`
  );
};

/**
 * @return {*} Функция, которая возвращает разметку компонента "Точка маршрута в режиме Edit"
 * @param {*} pointOfTrip Объект, содержащий свойства компонента "Точка маршрута в режиме Edit"
 * @param {*} options Объект, содержащий интерактивные свойства компонента "Точка маршрута в режиме Edit"
 */
const createEventEditTemplate = (pointOfTrip, options = {}) => {
  const {startDate, endDate, allActivities, allTransports, allDestinations, price, photos, isFavorite} = pointOfTrip;
  const {type, typeWithPreposition, destination, description, offers} = options;
  const start = formatDateTime(startDate);
  const end = formatDateTime(endDate);

  /** Разметка для точек с типом Transport */
  const pointTransportsMarkup = allTransports.map((it) => createPointTypeMarkup(it)).join(`\n`);
  /** Разметка для точек с типом Activities */
  const pointActivitiesMarkup = allActivities.map((it) => createPointTypeMarkup(it)).join(`\n`);
  /** Разметка для "Пунктов назначения для точек маршрута" */
  const pointDestinationsMarkup = allDestinations.map((it) => createDestinationMarkup(it)).join(`\n`);
  /** Разметка для "Дополнительных опций для точки маршрута" */
  const offersMarkup = offers.map((it) => createOfferMarkup(it.type, it.price, it.isChecked)).join(`\n`);
  /** Разметка для "Описания точки маршрута" */
  const descriptionMarkup = description.join(`\n`);
  /** Разметка для "Фотографий точки маршрута" */
  const photosMarkup = photos.map((it) => createPhotosMarkup(it)).join(`\n`);

  /** Флаг: Показывать блок "Дополнительные опции для точки маршрута"? */
  const isOfferShowing = !!offersMarkup;
  /** Флаг: Показывать блок "Описание точки маршрута"? */
  const isDescriptionShowing = !!descriptionMarkup;
  /** Флаг: Показывать блок "Фотографии точки маршрута"? */
  const isPhotosShowing = !!photosMarkup;
  /** Флаг: Показывать блок с Дополнительными опциями, Описанием и Фотографиями точки маршрута? */
  const isPointDetailsShowing = isOfferShowing || isDescriptionShowing || isPhotosShowing;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${pointTransportsMarkup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${pointActivitiesMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typeWithPreposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${pointDestinationsMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${end}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      ${isPointDetailsShowing ?
      `<section class="event__details">
      ${isOfferShowing ?
      `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${offersMarkup}
          </div>
        </section>`
      : ``}

        <section class="event__section  event__section--destination">
        ${isDescriptionShowing ?
      `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${descriptionMarkup}</p>`
      : ``}
      ${isPhotosShowing ?
      `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${photosMarkup}
            </div>
          </div>`
      : ``}
        </section>
      </section>`
      : ``}
    </form>`
  );
};

/** Компонент: "Точка маршрута в режиме Edit" */
export default class PointEdit extends AbstractSmartComponent {
  /**
   * Свойства компонента "Точка маршрута в режиме Edit"
   * @property {*} this._point - Компонент "Точка маршрута в режиме DEFAULT"
   * @param {*} point Компонент "Точка маршрута в режиме DEFAULT"
   */
  constructor(point) {
    super();
    this._point = point;
    this._type = point.type;
    this._typeWithPreposition = point.typeWithPreposition;
    this._destination = point.destination;
    this._description = point.description;
    this._offers = point.offers;

    this._submitHandler = null;
    this._subscribeOnEvents();
  }

  /** @return {*} Метод, который возвращает разметку компонента "Точка маршрута в режиме Edit" */
  getTemplate() {
    return createEventEditTemplate(this._point, {
      type: this._type,
      typeWithPreposition: this._typeWithPreposition,
      destination: this._destination,
      description: this._description,
      offers: this._offers,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  reset() {
    this.rerender();
  }

  /**
   * Метод, который устанавливает колбэк на клик по кнопке Save
   * @param {*} handler Колбэк для клика по кнопке Save
   */
  setSubmitHandler(handler) {
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, handler);
    this._submitHandler = handler;
  }

  /**
   * Метод, который устанавливает колбэк на клик по звёздочке (Favorite)
   * @param {*} handler Колбэк для клика по звёздочке (Favorite)
   */
  setFavoriteChangeHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, handler);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {

      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const pointType = evt.target.value;
      if (this._type === pointType) {
        return;
      }

      this._type = pointType;
      this._typeWithPreposition = `${ALL_POINT_ACTION[this._type]} ${addPreposition(ALL_POINT_ACTION[this._type])}`;
      this._offers = POINT_WITH_OFFERS[this._type];

      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const pointDestination = evt.target.value;
      if (this._destination === pointDestination) {
        return;
      }

      this._destination = pointDestination;

      if (!this._point.allDestinations.includes(this._destination)) {
        this._description = [];
      } else {
        this._description = this._point.allDescriptions[this._point.allDestinations.findIndex((it) => it === this._destination)];
      }

      this.rerender();
    });

  }
}
