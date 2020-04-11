import {EVENT_ACTIVITY, EVENT_TRANSPORT, EVENT_DESTINATION, EVENT_DESCRIPTION} from "../const.js";
import {generateOffers} from "../mock/event.js";
import {generateRandomArrayFromAnother} from "../utils.js";

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

const eventOffers = generateRandomArrayFromAnother(generateOffers(), 0, 4);

export const createEventEditTemplate = () => {

  const eventTransportsMarkup = EVENT_TRANSPORT.map((it) => createEventTypeMarkup(it.toLowerCase())).join(`\n`);
  const eventActivitiesMarkup = EVENT_ACTIVITY.map((it) => createEventTypeMarkup(it.toLowerCase())).join(`\n`);
  const eventDestinationsMarkup = EVENT_DESTINATION.map((it) => createDestinationMarkup(it)).join(`\n`);
  const offersMarkup = eventOffers.map((it) => createOfferMarkup(it[0], it[1], Math.random() > 0.5)).join(`\n`);
  const descriptionMarkup = generateRandomArrayFromAnother(EVENT_DESCRIPTION, 1, 5).join(`\n`);

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
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
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
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${offersMarkup}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${descriptionMarkup}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              <img class="event__photo" src="http://picsum.photos/248/152?r=${Math.random()}" alt="Event photo">
              <img class="event__photo" src="http://picsum.photos/248/152?r=${Math.random()}" alt="Event photo">
              <img class="event__photo" src="http://picsum.photos/248/152?r=${Math.random()}" alt="Event photo">
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};
