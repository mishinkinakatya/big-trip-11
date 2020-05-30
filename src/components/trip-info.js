import AbstractComponent from "./abstract-component.js";
import {remove} from "../utils/render.js";

const createTripInfoTemplate = (title, dates, cost) =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${dates}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;

export default class TripInfo extends AbstractComponent {
  constructor(title, dates, cost) {
    super();

    this._title = title;
    this._dates = dates;
    this._cost = cost;
  }

  getTemplate() {
    return createTripInfoTemplate(this._title, this._dates, this._cost);
  }

  clear() {
    remove(this);
  }
}
