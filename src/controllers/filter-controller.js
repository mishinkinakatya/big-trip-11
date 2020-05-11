import FilterComponent from "../components/filter.js";

import {render, RenderPosition} from "../utils/render.js";
import AbstractController from "./abstract-controller.js";

/** Контроллер: "Фильтрация" */
export default class Filter extends AbstractController {
  constructor(container, model) {
    super(model);
    this._container = container;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._getActiveFilterType = this._getActiveFilterType.bind(this);
  }

  render() {
    this._filterComponent = new FilterComponent(this._getActiveFilterType);
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);
    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }

  _getActiveFilterType() {
    return this.getModel().getActiveFilterType();
  }

  _filterTypeChangeHandler(filterType) {
    this.getModel().setActiveFilterType(filterType);
  }
}
