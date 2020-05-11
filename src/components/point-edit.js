import AbstractSmartComponent from "./abstract-smart-component.js";
import {POINTS_ACTION_WITH_OFFERS, POINTS_DESTINATION_WITH_DESCRIPTION, getPointDurationInDHM} from "../utils/common.js";
import {ALL_POINT_ACTION, POINT_ACTIVITY, POINT_TRANSPORT, ALL_DESTINATION} from "../const.js";
import flatpickr from "flatpickr";
import moment from "moment";

import "flatpickr/dist/flatpickr.min.css";

/**
* @return {*} Функция, которая возвращает разметку блока "Тип точки маршрута"
* @param {*} type Тип точки маршрута
* @param {*} currentType Выбранный тип точки маршрута
*/
const createPointTypeMarkup = (type, currentType) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${ALL_POINT_ACTION[type].substr(0, type.length)}</label>
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
  const {photos, isFavorite, price} = pointOfTrip;
  const {type, typeWithPreposition, destination, description, offers, startDate, endDate} = options;

  /** Разметка для точек с типом Transport */
  const pointTransportsMarkup = Object.keys(POINT_TRANSPORT).map((it) => createPointTypeMarkup(it, type)).join(`\n`);
  /** Разметка для точек с типом Activities */
  const pointActivitiesMarkup = Object.keys(POINT_ACTIVITY).map((it) => createPointTypeMarkup(it, type)).join(`\n`);
  /** Разметка для "Пунктов назначения для точек маршрута" */
  const pointDestinationsMarkup = ALL_DESTINATION.map((it) => createDestinationMarkup(it)).join(`\n`);
  /** Разметка для "Дополнительных опций для точки маршрута" */
  const offersMarkup = offers ? offers.map((it) => createOfferMarkup(it.type, it.price, it.isChecked)).join(`\n`) : ``;
  /** Разметка для "Описания точки маршрута" */
  const descriptionMarkup = description ? description.join(`\n`) : ``;
  /** Разметка для "Фотографий точки маршрута" */
  const photosMarkup = photos ? photos.map((it) => createPhotosMarkup(it)).join(`\n`) : ``;

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
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
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

const parseFormData = (formData) => {
  const destination = formData.get(`event-destination`);
  const description = destination ? POINTS_DESTINATION_WITH_DESCRIPTION.find((it) => it.destination === destination).description : ``;
  const type = formData.get(`event-type`);
  const startDate = moment(formData.get(`event-start-time`)).toDate();
  const endDate = moment(formData.get(`event-end-time`)).toDate();
  return {
    description,
    destination,
    duration: getPointDurationInDHM(startDate, endDate),
    endDate,
    isFavorite: formData.get(`.event-favorite`),
    offers: ``,
    photos: null,
    price: formData.get(`event-price`),
    startDate,
    type,
    typeWithPreposition: ALL_POINT_ACTION[type],
  };
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
    this._startDate = point.startDate;
    this._endDate = point.endDate;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._submitHandler = null;
    this._resetButtonClickHandler = null;

    this._applyFlatpickr();
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
      startDate: this._startDate,
      endDate: this._endDate,
    });
  }

  /** Метод, который перенавешивает слушателей */
  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setResetButtonClickHandler(this._resetButtonClickHandler);
    this._subscribeOnEvents();
  }

  /** Метод, котоырй сбрасывает все изменения в контроллере */
  reset() {
    const point = this._point;

    this._type = point.type;
    this._typeWithPreposition = point.typeWithPreposition;
    this._destination = point.destination;
    this._description = point.description;
    this._offers = point.offers;
    this._startDate = point.startDate;
    this._endDate = point.endDate;

    this.rerender();
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    // debugger;

    console.log(`formData`);
    console.log(parseFormData(formData));
    return parseFormData(formData);
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

  setResetButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._resetButtonClickHandler = handler;
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  removeElement() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    super.removeElement();
  }

  /** Приватный метод, который подключает flatpickr к элементам с датой */
  _applyFlatpickr() {
    if (this._flatpickrStart || this._flatpickrEnd) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    const dateStartElements = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndElements = this.getElement().querySelector(`#event-end-time-1`);

    this._flatpickrStart = flatpickr(dateStartElements, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._startDate || `today`,
      enableTime: true,
    });

    this._flatpickrEnd = flatpickr(dateEndElements, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._endDate || `today`,
      enableTime: true,
      minDate: this._startDate,
    });
  }

  /** Приватный метод, который подписывается на события: Изменение типа точки маршрута, пункта назначения, даты начала и конца, цены */
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
      this._typeWithPreposition = `${ALL_POINT_ACTION[this._type]}`;
      this._offers = POINTS_ACTION_WITH_OFFERS[this._type];

      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const pointDestination = evt.target.value;
      if (this._destination === pointDestination) {
        return;
      }

      this._destination = pointDestination;
      if (!ALL_DESTINATION.includes(this._destination)) {
        this._description = [];
      } else {
        this._description = POINTS_DESTINATION_WITH_DESCRIPTION.find((it) => it.destination === this._destination).description;
      }

      this.rerender();
    });

    element.querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      const pointStartDate = evt.target.value;
      if (this._startDate === pointStartDate) {
        return;
      }

      this._startDate = pointStartDate;

      if (this._startDate > this._endDate) {
        this._endDate = this._startDate;
      }

      this.rerender();
    });

    element.querySelector(`#event-end-time-1`).addEventListener(`change`, (evt) => {
      const pointEndDate = evt.target.value;
      if (this._endDate === pointEndDate) {
        return;
      }

      this._endDate = pointEndDate;

      this.rerender();
    });
  }
}
