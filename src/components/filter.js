import AbstractComponent from "./abstract-component.js";

/** @return {*} Метод, который возвращает разметку одного фильтра
 * @param {*} filterName Название фильтра
 * @param {*} isChecked Флаг: Фильтр выбран?
 */
const createFilterMarkup = (filterName, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
    </div>`
  );
};

/** @return {*} Метод, который возвращает разметку компонента "Фильтрация"
 * @param {*} filters Массив фильтров
 */
const createFilterTemplate = (filters) => {
  /** Разметка для всех фильтров */
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

/** Компонент: "Фильтрация" */
export default class Filter extends AbstractComponent {
  /**
   * Свойства компонента "Фильтрация"
   * @property {*} this._filters - Массив фильтров
   * @param {*} filters Массив фильтров
   */
  constructor(filters) {
    super();
    this._filters = filters;
  }

  /** @return {*} Метод, который возвращает разметку компонента "Фильтрация" */
  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
