import AbstractComponent from "./abstract-component.js";
import {FilterType} from "../const.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

/** @return {*} Метод, который возвращает разметку одного фильтра
 * @param {*} activeFilterType Активный фильтр
 */
const createFilterMarkup = (activeFilterType) => {
  return Object.values(FilterType).map((it) => {

    return (
      `<div class="trip-filters__filter">
        <input id="filter-${it}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${it}" ${it === activeFilterType ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${it}">${it}</label>
      </div>`
    );
  }).join(`\n`);
};

/** @return {*} Метод, который возвращает разметку компонента "Фильтрация"
 * @param {*} activeFilterType Активный фильтр
 */
const createFilterTemplate = (activeFilterType) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${createFilterMarkup(activeFilterType)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

/** Компонент: "Фильтрация" */
export default class Filter extends AbstractComponent {
  /**
   * Свойства компонента "Фильтрация"
   * @property {*} this._getActiveFilterType
   * @param {*} getActiveFilterType
   */
  constructor(getActiveFilterType) {
    super();
    this._getActiveFilterType = getActiveFilterType;
  }

  /** @return {*} Метод, который возвращает разметку компонента "Фильтрация" */
  getTemplate() {
    const activeFilterType = this._getActiveFilterType();
    return createFilterTemplate(activeFilterType);
  }

  setFilterTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
