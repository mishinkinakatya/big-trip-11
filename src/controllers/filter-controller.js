import FilterComponent from "../components/filter.js";

import AbstractController from "./abstract-controller.js";
import {ChangePropertyType} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";

export default class FilterController extends AbstractController {
  constructor(container, model) {
    super(container, model);

    this._filterTypeChangeFromViewHandler = this._filterTypeChangeFromViewHandler.bind(this);
    this._getActiveFilterType = this._getActiveFilterType.bind(this);
    this._availableFilterChangesHandler = this._availableFilterChangesHandler.bind(this);

    this.getModel().setAvailableFiltersChangeObserver(this._availableFilterChangesHandler);
    this._filterComponent = new FilterComponent(this._getActiveFilterType);
  }

  render() {
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeFromViewHandler);
    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }

  forceDisabled() {
    this._filterComponent.setAvailableFilters([]);
  }

  restoreFilters() {
    this._filterComponent.setAvailableFilters(this.getModel().getAvailableFilters());
  }

  _getActiveFilterType() {
    return this.getModel().getActiveFilterType();
  }

  _availableFilterChangesHandler(filterTypes) {
    this._filterComponent.setAvailableFilters(filterTypes);
  }

  _filterTypeChangeFromViewHandler(filterType) {
    this.getModel().setActiveFilterType(filterType, ChangePropertyType.FROM_VIEW);
  }
}
