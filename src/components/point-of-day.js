import AbstractComponent from "./abstract-component.js";
import {formatTime} from "../utils/common.js";

const createOfferMarkup = (offerType, offerPrice) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offerType}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
    </li>`
  );
};

const createPointOfDayTemplate = (pointOfDay) => {
  const {type, typeWithPreposition, destination, price, startDate, endDate, duration, offers} = pointOfDay;

  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

  const OFFERS_MAX_COUNT = 3;

  const checkedOffers = offers ? offers.filter((offer) => {
    return offer.isChecked;
  }) : null;

  const showingOffersOfDay = checkedOffers ? checkedOffers.slice(0, OFFERS_MAX_COUNT) : null;
  const offersMarkup = showingOffersOfDay ? showingOffersOfDay.map((it) => createOfferMarkup(it.title, it.price)).join(`\n`) : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeWithPreposition} ${destination}</h3>

        <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${startDate}">${startTime}</time>
              &mdash;
              <time class="event__end-time" datetime="${endDate}">${endTime}</time>
            </p>
            <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class PointOfDay extends AbstractComponent {
  constructor(pointOfDay) {
    super();
    this._pointOfDay = pointOfDay;
  }

  getTemplate() {
    return createPointOfDayTemplate(this._pointOfDay);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
