import AbstractComponent from "./abstract-component.js";
import {MONTH} from "../const.js";

const createDescriptionDate = (item) => {

  let monthName = MONTH[item.slice(6, 7)];
  const dateNumber = item.slice(8, 10);

  return (
    `${monthName} ${dateNumber}`
  );
};

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
const createTripDaysTemplate = (number, day) => {
  const dayInfoMarkup = createDayInfoMarkup(number, day);

  return (
    `<li class="trip-days__item  day">
      ${dayInfoMarkup}
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class TripDay extends AbstractComponent {
  constructor(dayNumber, day) {
    super();
    this._day = day;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return createTripDaysTemplate(this._dayNumber, this._day);
  }
}

