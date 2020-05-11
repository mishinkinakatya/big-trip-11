import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";

/** Контроллер: "Фильтрация" */
export default class Filter {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);

    this._pointsModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType,
      };
    });

    // const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);
    render(container, this._filterComponent, RenderPosition.BEFOREEND);

    // if (oldComponent) {
    //   replace(this._filterComponent, oldComponent);
    // } else {
    //   render(container, this._filterComponent, RenderPosition.BEFOREEND);
    // }

  }

  _filterChangeHandler(filterType) {
    this._pointsModel.setFilterType(filterType);
    this._activeFilterType = filterType;
  }

  _dataChangeHandler() {
    this._pointsModel.setFilterType(this._activeFilterType);
  }
}
