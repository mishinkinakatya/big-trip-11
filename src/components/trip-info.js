import AbstractComponent from "./abstract-component.js";
import {remove} from "../utils/render.js";

const createTripInfoTemplate = (title, dates, coast) =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${dates}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${coast}</span>
    </p>
  </section>`;

export default class TripInfo extends AbstractComponent {
  constructor(title, dates, coast) {
    super();

    this._title = title;
    this._dates = dates;
    this._coast = coast;
  }

  getTemplate() {
    return createTripInfoTemplate(this._title, this._dates, this._coast);
  }

  clearTripInfo() {
    remove(this);
  }
}
