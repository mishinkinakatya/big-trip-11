import SortComponent from "../components/sort.js";
import {render, RenderPosition} from "../utils/render.js";
import AbstractController from "./abstract-controller.js";

/** Контроллер: "Сортировка" */
export default class SortController extends AbstractController {
  constructor(container, model) {
    super(model);
    this._container = container;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._getActiveSortType = this._getActiveSortType.bind(this);
  }

  render() {
    const sortComponent = new SortComponent(this._getActiveSortType);
    sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    render(this._container, sortComponent, RenderPosition.BEFOREEND);
  }

  _getActiveSortType() {
    return this.getModel().getActiveSortType();
  }

  _sortTypeChangeHandler(sortType) {
    this.getModel().setActiveSortType(sortType);
  }
}
