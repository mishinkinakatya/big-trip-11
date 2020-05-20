import AbstractSmartComponent from "./abstract-smart-component.js";
import {getPointDurationInDHM, pointsActionWithOffers, POINTS_DESTINATION_WITH_DESCRIPTION} from "../utils/common.js";
import {ALL_DESTINATION, ALL_POINT_ACTION, POINT_ACTIVITY, POINT_TRANSPORT} from "../const.js";
import flatpickr from "flatpickr";
import moment from "moment";
import "flatpickr/dist/flatpickr.min.css";

const OFFER_NAME_PREFIX = `event-offer-`;

const getOfferByName = (name) => {
  return name.substring(OFFER_NAME_PREFIX.length);
};

/**
* @return {*} Функция, которая возвращает разметку блока "Тип точки маршрута"
* @param {*} type Тип точки маршрута
* @param {*} currentType Выбранный тип точки маршрута
*/
const createPointTypeMarkup = (type, currentType) =>
  `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${ALL_POINT_ACTION[type].substr(0, type.length)}</label>
  </div>`;

/** @return {*} Функция, которая возвращает разметку блока "Пункт назначения для точки маршрута" */
const createDestinationMarkup = () => {
  return (
    ALL_DESTINATION.map((it) => {
      return (`<option value="${it}"></option>`);
    }).join(`\n`)
  );
};

/**
  * @return {*} Функция, которая возвращает разметку блока "Дополнительные опции для точки маршрута"
  * @param {string} offers Дополнительные опции
  */
const createOfferMarkup = (offers) => {
  return offers ? offers.map((it) => {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${it.type}-1" type="checkbox" name="event-offer-${it.type}" ${it.isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${it.type}-1">
          <span class="event__offer-title">${it.type}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
        </label>
      </div>`
    );
  }).join(`\n`) : ``;
};

/**
* @return {*} Функция, которая возвращает разметку блока "Фотография точки маршрута"
* @param {string} photos Src фотографии
*/
const createPhotosMarkup = (photos) => {
  return photos ? photos.map((it) => {
    return (
      `<img class="event__photo" src="${it}" alt="Event photo"></img>`
    );
  }).join(`\n`) : ``;
};

/**
 * @return {*} Функция, которая возвращает разметку компонента "Точка маршрута в режиме Edit"
 * @param {*} pointOfTrip Объект, содержащий свойства компонента "Точка маршрута в режиме Edit"
 * @param {*} options Объект, содержащий интерактивные свойства компонента "Точка маршрута в режиме Edit"
 */
const createEventEditTemplate = (pointOfTrip) => {
  const {photos, isFavorite, price, type, typeWithPreposition, destination, description, offers, startDate, endDate} = pointOfTrip;

  const pointTransportsMarkup = Object.keys(POINT_TRANSPORT).map((it) => createPointTypeMarkup(it, type)).join(`\n`);
  const pointActivitiesMarkup = Object.keys(POINT_ACTIVITY).map((it) => createPointTypeMarkup(it, type)).join(`\n`);

  const pointDestinationsMarkup = createDestinationMarkup();
  const offersMarkup = createOfferMarkup(offers);
  const descriptionMarkup = description ? description.join(`\n`) : ``;
  const photosMarkup = createPhotosMarkup(photos);

  const isOfferShowing = !!offersMarkup;
  const isDescriptionShowing = !!descriptionMarkup;
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

/** Компонент: "Точка маршрута в режиме Edit" */
export default class PointEdit extends AbstractSmartComponent {
  /**
   * Свойства компонента "Точка маршрута в режиме Edit"
   * @param {*} getActualPointData
   * @param {*} updateTempPoint
   * @param {*} getTempPointData
   */
  constructor(getActualPointData, updateTempPoint, getTempPointData) {
    super();
    this._getActualPointData = getActualPointData;
    this._updateTempPoint = updateTempPoint;
    this._getTempPointData = getTempPointData;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._submitHandler = null;
    this._resetButtonClickHandler = null;

    this._tempPoint = getTempPointData();

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  /** @return {*} Метод, который возвращает разметку компонента "Точка маршрута в режиме Edit" */
  getTemplate() {
    return createEventEditTemplate(this._tempPoint);
  }

  /** Метод, который перенавешивает слушателей */
  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setResetButtonClickHandler(this._resetButtonClickHandler);
    this._subscribeOnEvents();
  }

  /**
   * Метод, который устанавливает колбэк на клик по кнопке Save
   * @param {*} handler Колбэк для клика по кнопке Save
   */
  setSubmitHandler(handler) {
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, handler);
    this._submitHandler = handler;
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
      defaultDate: this._tempPoint.startDate || `today`,
      enableTime: true,
      // time_24hr: true,
    });

    this._flatpickrEnd = flatpickr(dateEndElements, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._tempPoint.endDate || `today`,
      enableTime: true,
      minDate: this._tempPoint.startDate,
      // time_24hr: true,
    });
  }

  // Если newTempPoint - null, то нет обновления модели и перерисовки
  _onChangeDataPoint(applyChangeToTempPoint) {
    const newTempPoint = applyChangeToTempPoint(this._tempPoint);
    if (newTempPoint) {
      this._updateTempPoint(newTempPoint);
      this.rerender();
    }
  }

  /** Приватный метод, который подписывается на события: Изменение типа точки маршрута, пункта назначения, даты начала и конца, цены и дополнительных опций */
  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const pointType = evt.target.value;
      this._onChangeDataPoint((tempPoint) => {
        if (tempPoint.type === pointType) {
          return null;
        }

        const pointTypeWithPreposition = `${ALL_POINT_ACTION[pointType]}`;
        const pointOffers = pointsActionWithOffers[pointType];

        const newTempPoint = tempPoint;
        newTempPoint.type = pointType;
        newTempPoint.typeWithPreposition = pointTypeWithPreposition;
        newTempPoint.offers = pointOffers;

        return newTempPoint;
      });
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      let pointDestination = evt.target.value;

      this._onChangeDataPoint((tempPoint) => {
        if (tempPoint.destination === pointDestination) {
          return null;
        }
        if (!ALL_DESTINATION.includes(pointDestination)) {
          pointDestination = tempPoint.destination;
        }

        const pointDescription = pointDestination !== `` ? POINTS_DESTINATION_WITH_DESCRIPTION.find((it) => it.destination === pointDestination).description : ``;

        const newTempPoint = tempPoint;
        newTempPoint.destination = pointDestination;
        newTempPoint.description = pointDescription;
        return newTempPoint;
      });
    });

    element.querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      const pointStartDate = moment(evt.target.value).toDate();
      this._onChangeDataPoint((tempPoint) => {

        if (tempPoint.startDate === pointStartDate) {
          return null;
        }

        const newTempPoint = tempPoint;

        if (pointStartDate > tempPoint.endDate) {
          newTempPoint.endDate = pointStartDate;
        }

        newTempPoint.startDate = pointStartDate;
        newTempPoint.duration = getPointDurationInDHM(newTempPoint.startDate, newTempPoint.endDate);
        return newTempPoint;
      });
    });

    element.querySelector(`#event-end-time-1`).addEventListener(`change`, (evt) => {
      const pointEndDate = moment(evt.target.value).toDate();
      this._onChangeDataPoint((tempPoint) => {
        if (tempPoint.endDate === pointEndDate) {
          return null;
        }
        const newTempPoint = tempPoint;
        newTempPoint.endDate = pointEndDate;
        newTempPoint.duration = getPointDurationInDHM(newTempPoint.startDate, newTempPoint.endDate);
        return newTempPoint;
      });
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      let pointPrice = evt.target.value;

      this._onChangeDataPoint((tempPoint) => {
        if (tempPoint.price === pointPrice) {
          return null;
        }
        if (!Number.isInteger(Number(pointPrice))) {
          pointPrice = tempPoint.price;
        }
        const newTempPoint = tempPoint;
        newTempPoint.price = Number(pointPrice);
        return newTempPoint;
      });
    });

    element.querySelector(`.event__favorite-checkbox`).addEventListener(`change`, () => {
      this._onChangeDataPoint((tempPoint) => {

        const newTempPoint = tempPoint;
        newTempPoint.isFavorite = !tempPoint.isFavorite;
        return newTempPoint;
      });
    });

    element.querySelector(`.event__available-offers`).addEventListener(`change`, (evt) => {
      const pointOffer = getOfferByName(evt.target.name);
      this._onChangeDataPoint((tempPoint) => {

        const newTempPoint = tempPoint;

        const currentOfferIsChecked = tempPoint.offers.find((it) => it.type === pointOffer).isChecked;
        newTempPoint.offers.find((it) => it.type === pointOffer).isChecked = !currentOfferIsChecked;
        return newTempPoint;
      });
    });

  }
}
