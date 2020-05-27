import AbstractSmartComponent from "./abstract-smart-component.js";
import {ChangePropertyType, FilterType} from "../const.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

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

const createFilterTemplate = (activeFilterType, availableFilters) =>
  `<form class="trip-filters" action="#" method="get">
    ${createFilterMarkup(activeFilterType, availableFilters)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class Filter extends AbstractSmartComponent {
  constructor(getActiveFilterType) {
    super();
    this._getActiveFilterType = getActiveFilterType;
    this._availableFilters = [];
  }

  getTemplate() {
    return createFilterTemplate(this._getActiveFilterType(), this._availableFilters);
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
