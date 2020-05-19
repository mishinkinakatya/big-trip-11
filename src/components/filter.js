import AbstractSmartComponent from "./abstract-smart-component.js";
import {ChangePropertyType, FilterType} from "../const.js";
import {remove} from "../utils/render.js";

const FILTER_ID_PREFIX = `filter-`;

// TODO! Заменить на data-атрибуты
const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

/** @return {*} Метод, который возвращает разметку одного фильтра
 * @param {*} activeFilterType Активный фильтр
 * @param {*} availableFilters Доступные фильтры
 */
const createFilterMarkup = (activeFilterType, availableFilters) => {
  const isAvailableFilters = availableFilters.length > 0 ? true : false;
  return Object.values(FilterType).map((it) => {
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${it}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${it}" ${it === activeFilterType ? `checked` : ``} ${isAvailableFilters && availableFilters.includes(it) ? `` : `disabled`}>
        <label class="trip-filters__filter-label" for="filter-${it}">${it}</label>
      </div>`
    );
  }).join(`\n`);
};

/**
 * @param {*} activeFilterType Активный фильтр
 * @param {*} availableFilters Доступные фильтры
 * @return {*} Метод, который возвращает разметку компонента "Фильтрация"
 */
const createFilterTemplate = (activeFilterType, availableFilters) =>
  `<form class="trip-filters" action="#" method="get">
    ${createFilterMarkup(activeFilterType, availableFilters)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

/** Компонент: "Фильтрация" */
export default class Filter extends AbstractSmartComponent {
  /**
   * Свойства компонента "Фильтрация"
   * @property {*} this._getActiveFilterType
   * @param {*} getActiveFilterType
   */
  constructor(getActiveFilterType) {
    super();
    this._getActiveFilterType = getActiveFilterType;
    this._availableFilters = [];
  }

  /** @return {*} Метод, который возвращает разметку компонента "Фильтрация" */
  getTemplate() {
    return createFilterTemplate(this._getActiveFilterType(), this._availableFilters);
  }

  clearFilter() {
    remove(this);
  }

  recoveryListeners() {
    this.setFilterTypeChangeHandler(this._filterTypeChangeHandler);
  }

  setAvailableFilters(filterTypes) {
    this._availableFilters = filterTypes;
    this.rerender();
  }

  setFilterTypeChangeHandler(handler) {
    this._filterTypeChangeHandler = handler;
    this.getElement().addEventListener(`change`, (evt) => {
      handler(getFilterNameById(evt.target.id), ChangePropertyType.FROM_VIEW);
    });
  }
}
