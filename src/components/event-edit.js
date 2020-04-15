import {createElement, formatDateTime} from "../utils.js";

const createEventEditTemplate = (eventOfTrip) => {
  const {startDate, endDate, activity, transport, destination, price, description, offers, photos} = eventOfTrip;

  const start = formatDateTime(startDate);
  const end = formatDateTime(endDate);

  const createEventTypeMarkup = (eventType) => {
    const type = (eventType === `check`) ? `check-in` : eventType;
    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
      </div>`
    );
  };

  const eventTransportsMarkup = transport.map((it) => createEventTypeMarkup(it.toLowerCase())).join(`\n`);
  const eventActivitiesMarkup = activity.map((it) => createEventTypeMarkup(it.toLowerCase())).join(`\n`);

  const createDestinationMarkup = (eventDestination) => {
    return (
      `<option value="${eventDestination}"></option>`
    );
  };

  const eventDestinationsMarkup = destination.map((it) => createDestinationMarkup(it)).join(`\n`);

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

  const offersMarkup = offers.map((it) => createOfferMarkup(it[0], it[1], Math.random() > 0.5)).join(`\n`);
  const isOfferShowing = !!offersMarkup;

  const descriptionMarkup = description.join(`\n`);
  const isDescriptionShowing = !!descriptionMarkup;

  const createPhotosMarkup = (photo) => {
    return (
      `<img class="event__photo" src="${photo}" alt="Event photo"></img>`
    );
  };

  const photosMarkup = photos.map((it) => createPhotosMarkup(it)).join(`\n`);
  const isPhotosShowing = !!photosMarkup;

  const isEventDetailsShowing = isOfferShowing || isDescriptionShowing || isPhotosShowing;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${eventTransportsMarkup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${eventActivitiesMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            Flight to
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
          <datalist id="destination-list-1">
            ${eventDestinationsMarkup}
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
      </header>

      ${isEventDetailsShowing ?
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

export default class EventsEdit {
  constructor(event) {
    this._event = event;

    this._element = null;
  }

  getTemplate() {
    return createEventEditTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
