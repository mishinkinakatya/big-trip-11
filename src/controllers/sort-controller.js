import AbstractController from "./abstract-controller.js";
import SortComponent from "../components/sort.js";
import {ChangePropertyType} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";

export default class SortController extends AbstractController {
  constructor(container, model) {
    super(container, model);

    this._getActiveSortType = this._getActiveSortType.bind(this);
    this._sortTypeChangeFromViewHandler = this._sortTypeChangeFromViewHandler.bind(this);
    this._sortTypeChangeFromModelHandler = this._sortTypeChangeFromModelHandler.bind(this);
    this.getModel().setActiveSortTypeChangeObserver(this._sortTypeChangeFromModelHandler);

    this._sortComponent = new SortComponent(this._getActiveSortType);
  }

  render() {
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeFromViewHandler);
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _getActiveSortType() {
    return this.getModel().getActiveSortType();
  }

  _rerender() {
    this._sortComponent.clearSort();
    this.render();
  }

  _sortTypeChangeFromViewHandler(sortType) {
    this.getModel().setActiveSortType(sortType, ChangePropertyType.FROM_VIEW);
  }

  _sortTypeChangeFromModelHandler(changePropertyType) {
    if (changePropertyType === ChangePropertyType.FROM_MODEL) {
      this._rerender();
    }
  }
}
