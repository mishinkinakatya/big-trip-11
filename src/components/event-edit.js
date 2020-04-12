import {EVENT_ACTIVITY, EVENT_TRANSPORT, EVENT_DESTINATION, EVENT_DESCRIPTION} from "../const.js";
import {generateOffers} from "../mock/event.js";
import {generateRandomArrayFromAnother, getRandomStartDate, getRandomEndDate, castDateTimeFormat} from "../utils.js";

const createEventTypeMarkup = (eventType) => {
  const type = (eventType === `check`) ? `check-in` : eventType;
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
    </div>`
  );
};

const createDestinationMarkup = (destination) => {
  return (
    `<option value="${destination}"></option>`
  );
};

const formatDateTime = (date) => {
  const day = castDateTimeFormat(date.getDate());
  const month = castDateTimeFormat(date.getMonth());
  const year = String(date.getFullYear()).slice(2, 4);
  const hours = castDateTimeFormat(date.getHours() % 12);
  const minutes = castDateTimeFormat(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const startDate = getRandomStartDate();
const endDate = getRandomEndDate(startDate);

const createOfferMarkup = (offer, price, isChecked) => {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer}-1" type="checkbox" name="event-offer-${offer}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${offer}-1">
        <span class="event__offer-title">Add ${offer}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createPhotosMarkup = () => {
  return (
    `<img class="event__photo" src="http://picsum.photos/248/152?r=${Math.random()}" alt="Event photo"></img>
     <img class="event__photo" src="http://picsum.photos/248/152?r=${Math.random()}" alt="Event photo"></img>
     <img class="event__photo" src="http://picsum.photos/248/152?r=${Math.random()}" alt="Event photo"></img>`
  );
};

const eventOffers = generateRandomArrayFromAnother(generateOffers(), 0, 4);


export const createEventEditTemplate = () => {

  const eventTransportsMarkup = EVENT_TRANSPORT.map((it) => createEventTypeMarkup(it.toLowerCase())).join(`\n`);
  const eventActivitiesMarkup = EVENT_ACTIVITY.map((it) => createEventTypeMarkup(it.toLowerCase())).join(`\n`);
  const eventDestinationsMarkup = EVENT_DESTINATION.map((it) => createDestinationMarkup(it)).join(`\n`);

  const offersMarkup = eventOffers.map((it) => createOfferMarkup(it[0], it[1], Math.random() > 0.5)).join(`\n`);
  const isOfferShowing = !!offersMarkup;

  const descriptionMarkup = generateRandomArrayFromAnother(EVENT_DESCRIPTION, 1, 5).join(`\n`);
  const isDescriptionShowing = !!descriptionMarkup;

  const photosMarkup = createPhotosMarkup();
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
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateTime(startDate)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateTime(endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
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
