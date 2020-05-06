import AbstractComponent from "./abstract-component.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

/** @return {*} Метод, который возвращает разметку одного фильтра
 * @param {*} filter Фильтр
 * @param {*} isChecked Флаг: Фильтр выбран?
 */
const createFilterMarkup = (filter, isChecked) => {
  const {name} = filter;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

/** @return {*} Метод, который возвращает разметку компонента "Фильтрация"
 * @param {*} filters Массив фильтров
 */
const createFilterTemplate = (filters) => {
  /** Разметка для всех фильтров */
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.isChecked)).join(`\n`);

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

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
