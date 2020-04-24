import AbstractComponent from "./abstract-component.js";

const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export const clearContent = (container) => {
  const containerContent = container.getElement();
  containerContent.innerHTML = ``;

  return containerContent;
};

export default class TripDays extends AbstractComponent {
  getTemplate() {
    return createTripDaysTemplate();
  }
}

