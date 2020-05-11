import AbstractComponent from "./abstract-component.js";
import TripWithoutDays from "./trip-without-days.js";
import DayOfTrip from "./day-of-trip.js";
import {render, RenderPosition} from "../utils/render.js";
import {PointMode} from "../const.js";

/** @return {*} Функция, которая возвращает разметку компонента "Блок с днями путешествия" */
const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

/** Компонент: "Блок с днями путешествия" */
export default class TripDays extends AbstractComponent {
  constructor() {
    super();
    this._points = [];
    this._tripWithoutDays = new TripWithoutDays();
    this._dayOfTrip = new DayOfTrip();
  }

  /** @return {*} Метод, который возвращает разметку компонента "Блок с днями путешествия" */
  getTemplate() {
    return createTripDaysTemplate();
  }

  render(container, points) {
    this._points = points;
    render(container, this, RenderPosition.BEFOREEND);
    render(this.getElement(), this._tripWithoutDays, RenderPosition.BEFOREEND);
    points.forEach((point) => {
      point.render(this._tripWithoutDays.getElement().querySelector(`.trip-events__list`), PointMode.DEFAULT);
    });
  }
}

