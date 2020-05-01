import AbstractComponent from "./abstract-component.js";
import {formatDate, formatTime} from "../utils/common.js";

/**
* @return {*} Функция, которая возвращает разметку блока с дополнительными опциями компонента "Один день маршрута"
* @param {*} offerType Тип опции
* @param {*} offerPrice Цена опции
*/
const createOfferMarkup = (offerType, offerPrice) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offerType}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
    </li>`
  );
};

/**
 * @return {*} Функция, которая возвращает разметку компонента "Одна точка маршрута"
 * @param {*} eventOfDay Объект, содержащий свойства компонента "Точка маршрута в режиме Default"
 */
const createEventOfDayTemplate = (eventOfDay) => {
  const {type, title, price, startDate, endDate, duration, offers} = eventOfDay;

  const startDay = formatDate(startDate);
  const endDay = formatDate(endDate);

  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

  const OFFERS_MAX_COUNT = 3;

  /** Массив, содержащий выбранные опции */
  const checkedOffers = offers.filter((offer) => {
    return offer.isChecked;
  });

  /** Массив, содержащий опции, которые будут отображаться в компонента "Точка маршрута в режиме Default" */
  const showingOffersOfDay = checkedOffers.slice(0, OFFERS_MAX_COUNT);
  /** Разметка для блока с дополнительными опциями */
  const offersMarkup = showingOffersOfDay.map((it) => createOfferMarkup(it.type, it.price)).join(`\n`);

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

/** Компонент: "Одна точка маршрута" */
export default class EventOfDay extends AbstractComponent {
  /**
   * Свойства компонента "Одна точка маршрута"
   * @property {*} this._eventOfDay - Компонент "Точка маршрута в режиме Default"
   * @param {*} eventOfDay Компонент "Точка маршрута в режиме Default"
   */
  constructor(eventOfDay) {
    super();
    this._eventOfDay = eventOfDay;
  }

  /** @return {*} Метод, который возвращает разметку компонента "Одна точка маршрута" */
  getTemplate() {
    return createEventOfDayTemplate(this._eventOfDay);
  }

  /**
   * Метод, который устанавливает колбэк на клик по стрелке Edit
   * @param {*} handler Колбэк для клика по стрелке Edit
   */
  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
