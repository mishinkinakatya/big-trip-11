import {MONTH} from "../const.js";
import {createElement} from "../utils.js";

const createTripDaysTemplate = (day) => {
  const createTripDay = (number, date, descriptionDate) => {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${number}</span>
          <time class="day__date" datetime="${date}">${descriptionDate}</time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>`
    );
  };

  const createDescriptionDate = (item) => {

    let monthNumber = item.slice(5, 6) === `0` ? MONTH[item.slice(6, 7)] : MONTH[item.slice(5, 7)];
    const dateNumber = item.slice(8, 10);

    return (
      `${monthNumber} ${dateNumber}`
    );
  };

  const uniqueSortDays = Array.from(new Set(day)).sort();

  const tripDays = uniqueSortDays.map((it, i) => createTripDay(i + 1, it, createDescriptionDate(it))).join(`\n`);
  return (
    `<ul class="trip-days">
      ${tripDays}
    </ul>`
  );
};

export default class TripDays {
  constructor(day) {
    this._day = day;

    this._element = null;
  }

  getTemplate() {
    return createTripDaysTemplate(this._day);
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

