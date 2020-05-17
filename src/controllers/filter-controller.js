import FilterComponent from "../components/filter.js";

import AbstractController from "./abstract-controller.js";
import {ChangePropertyType} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";

export default class FilterController extends AbstractController {
  constructor(container, model) {
    super(model);
    this._container = container;

    this._filterTypeChangeFromViewHandler = this._filterTypeChangeFromViewHandler.bind(this);
    this._filterTypeChangeFromModelHandler = this._filterTypeChangeFromModelHandler.bind(this);
    this._getActiveFilterType = this._getActiveFilterType.bind(this);
    this._availableFilterChangesHandler = this._availableFilterChangesHandler.bind(this);

    this.getModel().setAvailableFiltersChangeObserver(this._availableFilterChangesHandler);
    this._filterComponent = new FilterComponent(this._getActiveFilterType);
  }

  render() {
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeFromViewHandler);
    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }

  _availableFilterChangesHandler(filterTypes) {
    this._filterComponent.setAvailableFilters(filterTypes);
  }

  _getActiveFilterType() {
    return this.getModel().getActiveFilterType();
  }

  _filterTypeChangeFromModelHandler(changePropertyType) {
    if (changePropertyType === ChangePropertyType.FROM_MODEL) {
      this._rerender();
    }
  }

  _filterTypeChangeFromViewHandler(filterType) {
    this.getModel().setActiveFilterType(filterType, ChangePropertyType.FROM_VIEW);
  }

  _rerender() {
    this._sortComponent.clearSort();
    this.render();
  }
}
