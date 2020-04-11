import {formatDate, generateRandomArrayFromAnother} from "../utils.js";
import {generateOffers} from "../mock/event.js";

export const createDayEventTemplate = (dayEvent) => {
  const {eventType, eventTitle, eventPrice, eventStartDay, eventEndDay, eventStartTime, eventEndTime} = dayEvent;

  const startDay = formatDate(eventStartDay);
  const endDay = formatDate(eventEndDay);

  const eventDuration = `30M`;

  const createOfferMarkup = (type, price) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${type}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`
    );
  };

  const eventOffers = generateRandomArrayFromAnother(generateOffers(), 0, 3);

  const offersMarkup = eventOffers.map((it) => createOfferMarkup(it[0], it[1])).join(`\n`);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTitle}</h3>

        <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${startDay}T${eventStartTime}">${eventStartTime}</time>
              &mdash;
              <time class="event__end-time" datetime="${endDay}T${eventEndTime}">${eventEndTime}</time>
            </p>
            <p class="event__duration">${eventDuration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${eventPrice}</span>
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
