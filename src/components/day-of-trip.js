import AbstractComponent from "./abstract-component.js";
import moment from "moment";

const createDayInfoMarkup = (number, day) =>
  `<div class="day__info">
    ${number && day ?
    `<span class="day__counter">${number}</span>
      <time class="day__date" datetime="${day}">${moment(day).format(`MMM DD`)}</time>`
    : ``}
  </div>`;

const createDayOfTripTemplate = (number, day) =>
  `<li class="trip-days__item  day">
    ${createDayInfoMarkup(number, day)}
    <ul class="trip-events__list"></ul>
  </li>`;

export default class DayOfTrip extends AbstractComponent {
  constructor(dayNumber, day) {
    super();
    this._day = day;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return createDayOfTripTemplate(this._dayNumber, this._day);
  }
}

