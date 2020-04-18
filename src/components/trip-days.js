import AbstractComponent from "./abstract-component.js";
import {MONTH} from "../const.js";

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

  let monthName = MONTH[item.slice(6, 7)];
  const dateNumber = item.slice(8, 10);

  return (
    `${monthName} ${dateNumber}`
  );
};

const createTripDaysTemplate = (day) => {

  const uniqueSortDays = Array.from(new Set(day)).sort();
  const tripDays = uniqueSortDays.map((it, i) => createTripDay(i + 1, it, createDescriptionDate(it))).join(`\n`);
  return (
    `<ul class="trip-days">
      ${tripDays}
    </ul>`
  );
};

export default class TripDays extends AbstractComponent {
  constructor(days) {
    super();
    this._days = days;
  }

  getTemplate() {
    return createTripDaysTemplate(this._days);
  }
}

