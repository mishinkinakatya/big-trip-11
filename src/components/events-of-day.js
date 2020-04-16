import {createElement, formatDate, formatTime} from "../utils.js";

const createDayEventTemplate = (eventOfDay) => {
  const {type, title, price, startDate, endDate, duration, offers} = eventOfDay;

  const startDay = formatDate(startDate);
  const endDay = formatDate(endDate);

  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

  const createOfferMarkup = (offerType, offerPrice) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offerType}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
      </li>`
    );
  };

  const offersMaxCount = 3;
  const checkedOffers = offers.filter((offer) => {
    return offer[2];
  });
  const offersOfDay = checkedOffers.slice(0, offersMaxCount);

  const offersMarkup = offersOfDay.map((it) => createOfferMarkup(it[0], it[1])).join(`\n`);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>

        <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${startDay}T${startTime}">${startTime}</time>
              &mdash;
              <time class="event__end-time" datetime="${endDay}T${endTime}">${endTime}</time>
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

export default class EventsOfDay {
  constructor(event) {
    this._event = event;

    this._element = null;
  }

  getTemplate() {
    return createDayEventTemplate(this._event);
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
