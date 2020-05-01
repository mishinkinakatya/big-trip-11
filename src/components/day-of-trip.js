import AbstractComponent from "./abstract-component.js";
import {MONTH} from "../const.js";

/**
* @return {*} Функция, которая возвращает разметку блока "Тип точки маршрута"
* @param {*} item Тип точки маршрута
*/
const createDescriptionDate = (item) => {

  let monthName = MONTH[item.slice(6, 7)];
  const dateNumber = item.slice(8, 10);

  return (
    `${monthName} ${dateNumber}`
  );
};

/**
* @return {*} Функция, которая возвращает разметку блока с информацией компонента "Один день маршрута"
* @param {*} number Порядковый номер дня маршрута
* @param {*} day Дата дня маршрута
*/
const createDayInfoMarkup = (number, day) => {
  const descriptionDate = createDescriptionDate(day);
  return (
    `<div class="day__info">
    ${number && day ?
      `<span class="day__counter">${number}</span>
      <time class="day__date" datetime="${day}">${descriptionDate}</time>`
      : ``}
    </div>`
  );
};

/**
 * @return {*} Функция, которая возвращает разметку компонента "Один день маршрута"
 * @param {*} number Порядковый номер дня маршрута
 * @param {*} day Дата дня маршрута
 */
const createDayOfTripTemplate = (number, day) => {
  const dayInfoMarkup = createDayInfoMarkup(number, day);

  return (
    `<li class="trip-days__item  day">
      ${dayInfoMarkup}
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

/** Компонент: "Один день маршрута" */
export default class DayOfTrip extends AbstractComponent {
  /**
   * Свойства компонента "Один день маршрута"
   * @property {*} this._dayNumber - Порядковый номер дня маршрута
   * @property {*} this._day - Дата дня маршрута
   * @param {*} dayNumber Порядковый номер дня маршрута
   * @param {*} day Дата дня маршрута
   */
  constructor(dayNumber, day) {
    super();
    this._day = day;
    this._dayNumber = dayNumber;
  }

  /** @return {*} Метод, который возвращает разметку компонента "Один день маршрута" */
  getTemplate() {
    return createDayOfTripTemplate(this._dayNumber, this._day);
  }
}

