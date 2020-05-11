import PointOfDayComponent from "../components/point-of-day.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {POINTS_ACTION_WITH_OFFERS} from "../utils/common.js";
import AbstractController from "./abstract-controller.js";
import {PointMode} from "../const.js";

export const EmptyPoint = {
  description: ``,
  destination: ``,
  duration: null,
  endDate: Date.now(),
  isFavorite: false,
  offers: POINTS_ACTION_WITH_OFFERS[`bus`],
  photos: null,
  price: ``,
  startDate: Date.now(),
  type: `bus`,
  typeWithPreposition: `Bus to`,
};

/** Контроллер: "Точка маршрута" */
export default class PointController extends AbstractController {
  /**
   * Свойства контроллера "Точка маршрута"
   * @property {*} this._container - Компонент, внутри которого будет рендериться точка маршрута
   * @property {*} this._pointOfDayComponent - Компонент "Одна точка маршрута"
   * @property {*} this._pointEditComponent - Компонент "Точка маршрута в режиме Edit"
   * @property {*} this._escKeyDownHandler - Метод, который устанавливает колбэк на нажатие кнопки Esc
   * @param {*} model - Модель
   * @param {*} dataChangeHandler Метод, который измененяет данные и перерисовывает компонент
   * @param {*} viewChangeHandler Метод, который уведомляет все контроллеры точек маршрута, что они должны вернуться в дефолтный режим
   */

  constructor(model, dataChangeHandler, viewChangeHandler) {
    super(model);
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._mode = PointMode.DEFAULT;

    this._pointOfDayComponent = null;
    this._pointEditComponent = null;

    this._updateTempPoint = this._updateTempPoint.bind(this);
    this._getActualPointData = this._getActualPointData.bind(this);
    this._getTempPointData = this._getTempPointData.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  /**
  * Метод для рендеринга точки маршрута
  * @param {string} container
  * @param {string} mode Режим, в котором находится точка маршрута
  */
  render(container, mode) {
    const oldPointOfDayComponent = this._pointOfDayComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;
    const pointModel = this.getModel();

    this._pointOfDayComponent = new PointOfDayComponent(pointModel.getActualPoint());
    this._pointOfDayComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._pointEditComponent = new PointEditComponent(this._getActualPointData, this._updateTempPoint, this._getTempPointData);
    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this.getModel().applyChanges();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });
    this._pointEditComponent.setResetButtonClickHandler(() => this.getModel().resetChanges());
    this._pointEditComponent.setFavoriteChangeHandler(() => {
      this._dataChangeHandler(this, pointModel, Object.assign({}, pointModel, {
        isFavorite: !pointModel.isFavorite,
      }));
    });

    switch (this._mode) {
      case PointMode.DEFAULT:
        if (oldPointOfDayComponent && oldPointEditComponent) {
          replace(this._pointOfDayComponent, oldPointOfDayComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(container, this._pointOfDayComponent, RenderPosition.BEFOREEND);
        }
        break;
      case PointMode.ADDING:
        if (oldPointOfDayComponent && oldPointEditComponent) {
          remove(oldPointOfDayComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._escKeyDownHandler);
        render(container, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  _updateTempPoint(tempPoint) {
    return this.getModel().updateTempPoint(tempPoint);
  }

  _getActualPointData() {
    return this.getModel().getActualPoint();
  }

  _getTempPointData() {
    return this.getModel().getTempPoint();
  }

  /** Метод, который удаялет компоненты "Одна точка маршрута" и "Точка маршрута в режиме Edit" */
  destroy() {
    remove(this._pointOfDayComponent);
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  /** Метод, который возвращает Точку маршрута в дефолтное состояние */
  setDefaultView() {
    if (this._mode !== PointMode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  /** Приватный метод, который заменяет Точку маршрута в режиме Default, на Точку маршрута в режиме Edit */
  _replacePointToEdit() {
    // this._viewChangeHandler();
    replace(this._pointEditComponent, this._pointOfDayComponent);
    this._mode = PointMode.EDIT;
  }

  /** Приватный метод, который заменяет Точку маршрута в режиме Edit, на Точку маршрута в режиме Default */
  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._pointEditComponent.reset();
    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointOfDayComponent, this._pointEditComponent);
    }
    this._mode = PointMode.DEFAULT;
  }

  /** Приватный метод, который устанавливает колбэк на нажатие кнопки Esc
   * @param {*} evt Событие, которое произошло
   */
  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      if (this._mode === PointMode.ADDING) {
        this._dataChangeHandler(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
