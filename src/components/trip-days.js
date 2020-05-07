import AbstractComponent from "./abstract-component.js";

/** @return {*} Функция, которая возвращает разметку компонента "Блок с днями путешествия" */
const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

/** Компонент: "Блок с днями путешествия" */
export default class TripDays extends AbstractComponent {
  /** @return {*} Метод, который возвращает разметку компонента "Блок с днями путешествия" */
  getTemplate() {
    return createTripDaysTemplate();
  }
}

