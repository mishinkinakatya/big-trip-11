import {tripDay} from "../mock/event.js";

const createTripDay = (number, date) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime="${date}">MAR 18</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

const tripDays = tripDay.map((it, i) => createTripDay(i + 1, it)).join(`\n`);

export const createTripDaysTemplate = () =>
  `<ul class="trip-days">
    ${tripDays}
  </ul>`;

