import AbstractComponent from "./abstract-component.js";

const createTripWithoutDaysTemplate = () => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info"></div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class TripWithoutDays extends AbstractComponent {
  constructor() {
    super();
    this._points = [];
  }

  getTemplate() {
    return createTripWithoutDaysTemplate(this._points);
  }

  render(points) {
    this._points = points;
    return this.getTemplate();
  }
}
