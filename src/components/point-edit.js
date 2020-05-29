import AbstractSmartComponent from "./abstract-smart-component.js";
import {ALL_POINT_ACTION, POINT_ACTIVITY, POINT_TRANSPORT, ButtonNames, PointMode} from "../const.js";
import {getPointDurationInDHM, getPointDurationInMs} from "../utils/common.js";
import {getStorage} from "../storage-provider.js";
import flatpickr from "flatpickr";
import moment from "moment";
import "flatpickr/dist/flatpickr.min.css";


const OFFER_NAME_PREFIX = `event-offer-`;

const getOfferByName = (name) => {
  return name.substring(OFFER_NAME_PREFIX.length);
};

const createPointTypeMarkup = (type, currentType) =>
  `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${ALL_POINT_ACTION[type].substr(0, type.length)}</label>
  </div>`;

const createDestinationMarkup = () => {
  return getStorage().isDestinations() ? getStorage().getAllDestinations().map((destination) => destination.name).map((name) => {
    return (`<option value="${name}"></option>`);
  }).join(`\n`) : ``;
};

const createOfferMarkup = (offers, isDisabled) => {
  return offers ? offers.map((it) => {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${it.title}-1" type="checkbox" name="event-offer-${it.title}" ${it.isChecked ? `checked` : ``}  ${isDisabled}>
        <label class="event__offer-label" for="event-offer-${it.title}-1">
          <span class="event__offer-title">${it.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
        </label>
      </div>`
    );
  }).join(`\n`) : ``;
};

const createPhotosMarkup = (photos) => {
  return photos ? photos.map((photo) => {
    return (
      `<img class="event__photo" src="${photo.src}" alt="${photo.description}"></img>`
    );
  }).join(`\n`) : ``;
};

const createEventEditTemplate = (pointOfTrip, mode, isSending, buttonName) => {
  const {photos, isFavorite, price, type, typeWithPreposition, destination, description, offers, startDate, endDate} = pointOfTrip;

  let submitButton = ButtonNames.SAVE_DEFAULT;
  if (isSending && buttonName === ButtonNames.SAVE_DEFAULT) {
    submitButton = ButtonNames.SAVE_SENDING;
  }
  let resetButton = mode === PointMode.EDIT ? ButtonNames.DELETE_DEFAULT : ButtonNames.CANCEL;
  if (isSending && buttonName === ButtonNames.DELETE_DEFAULT) {
    resetButton = ButtonNames.DELETE_SENDING;
  }

  const isDisabled = isSending ? `disabled` : ``;

  const pointTransportsMarkup = Object.keys(POINT_TRANSPORT).map((it) => createPointTypeMarkup(it, type)).join(`\n`);
  const pointActivitiesMarkup = Object.keys(POINT_ACTIVITY).map((it) => createPointTypeMarkup(it, type)).join(`\n`);
  const pointDestinationsMarkup = createDestinationMarkup();
  const offersMarkup = createOfferMarkup(offers, isDisabled);
  const descriptionMarkup = description ? description : ``;
  const photosMarkup = createPhotosMarkup(photos);

  const isOfferShowing = !!offersMarkup;
  const isDescriptionShowing = !!descriptionMarkup;
  const isPhotosShowing = !!photosMarkup;

  const isPointDetailsShowing = isOfferShowing || isDescriptionShowing || isPhotosShowing;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled}>

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" ${isDisabled} required>
          <datalist id="destination-list-1">
            ${pointDestinationsMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}" ${isDisabled}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}" ${isDisabled}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" ${isDisabled} required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled}>${submitButton}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled}>${resetButton}</button>

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

export default class PointEdit extends AbstractSmartComponent {
  constructor(mode, getActualPointData, updateTempPoint, getTempPointData) {
    super();
    this._mode = mode;
    this._getActualPointData = getActualPointData;
    this._updateTempPoint = updateTempPoint;
    this._getTempPointData = getTempPointData;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._submitHandler = null;
    this._resetButtonClickHandler = null;
    this._rollupButtonClickHandler = null;

    this._tempPoint = getTempPointData();

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate(isSending, buttonName) {
    return createEventEditTemplate(this._tempPoint, this._mode, isSending, buttonName);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setResetButtonClickHandler(this._resetButtonClickHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender(isSending, buttonName) {
    super.rerender(isSending, buttonName);
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

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, handler);
    this._submitHandler = handler;
  }

  setResetButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._resetButtonClickHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    this._rollupButtonClickHandler = handler;
  }


  returnValidatedFields() {
    return {
      destination: this.getElement().querySelector(`.event__input--destination`),
      price: this.getElement().querySelector(`.event__input--price`),
    };
  }

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
    });

    this._flatpickrEnd = flatpickr(dateEndElements, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._tempPoint.endDate || `today`,
      enableTime: true,
      minDate: this._tempPoint.startDate,
    });
  }

  _onChangeDataPoint(applyChangeToTempPoint) {
    const newTempPoint = applyChangeToTempPoint(this._tempPoint);
    if (newTempPoint) {
      this._updateTempPoint(newTempPoint);
      this.rerender();
    }
  }

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
        const pointOffers = getStorage().isOffers() ? getStorage().getAllOffers().find((item) => item.type === pointType).offers : ``;

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
        if (!getStorage().getAllDestinations().map((destination) => destination.name).includes(pointDestination)) {
          pointDestination = tempPoint.destination;
        }

        const pointDescription = pointDestination !== `` ? getStorage().getAllDestinations().find((it) => it.name === pointDestination).description : ``;
        const pointPhotos = pointDestination !== `` ? getStorage().getAllDestinations().find((it) => it.name === pointDestination).pictures : ``;

        const newTempPoint = tempPoint;
        newTempPoint.destination = pointDestination;
        newTempPoint.description = pointDescription;
        newTempPoint.photos = pointPhotos;
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
        newTempPoint.durationInMs = getPointDurationInMs(newTempPoint.startDate, newTempPoint.endDate);
        newTempPoint.duration = getPointDurationInDHM(newTempPoint.durationInMs);
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
        newTempPoint.durationInMs = getPointDurationInMs(newTempPoint.startDate, newTempPoint.endDate);
        newTempPoint.duration = getPointDurationInDHM(newTempPoint.durationInMs);
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

    if (element.querySelector(`.event__available-offers`)) {
      element.querySelector(`.event__available-offers`).addEventListener(`change`, (evt) => {
        const pointOffer = getOfferByName(evt.target.name);
        this._onChangeDataPoint((tempPoint) => {

          const newTempPoint = tempPoint;

          const currentOfferIsChecked = tempPoint.offers.find((it) => it.title === pointOffer).isChecked;
          newTempPoint.offers.find((it) => it.title === pointOffer).isChecked = !currentOfferIsChecked;
          return newTempPoint;
        });
      });
    }
  }
}
