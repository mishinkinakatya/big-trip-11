import PointOfDayComponent from "../components/point-of-day.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {POINTS_ACTION_WITH_OFFERS} from "../utils/common.js";


export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

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
export default class PointController {
  /**
   * Свойства контроллера "Точка маршрута"
   * @property {*} this._container - Компонент, внутри которого будет рендериться точка маршрута
   * @property {*} this._pointOfDayComponent - Компонент "Одна точка маршрута"
   * @property {*} this._pointEditComponent - Компонент "Точка маршрута в режиме Edit"
   * @property {*} this._escKeyDownHandler - Метод, который устанавливает колбэк на нажатие кнопки Esc
   * @param {*} container Компонент, внутри которого будет рендериться точка маршрута
   * @param {*} dataChangeHandler Метод, который измененяет данные и перерисовывает компонент
   * @param {*} viewChangeHandler Метод, который уведомляет все контроллеры точек маршрута, что они должны вернуться в дефолтный режим
   */
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._mode = Mode.DEFAULT;

    this._pointOfDayComponent = null;
    this._pointEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  /**
  * Метод для рендеринга точки маршрута
  * @param {object} point Объект, который описывает свойства одной точки маршрута
  * @param {string} mode Режим, в котором находится точка маршрута
  */
  render(point, mode) {
    const oldPointOfDayComponent = this._pointOfDayComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    this._pointOfDayComponent = new PointOfDayComponent(point);
    this._pointEditComponent = new PointEditComponent(point);

    this._pointOfDayComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._pointEditComponent.getData();
      this._dataChangeHandler(this, point, data);
      // document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._pointEditComponent.setResetButtonClickHandler(() => this._dataChangeHandler(this, point, oldPointOfDayComponent));

    this._pointEditComponent.setFavoriteChangeHandler(() => {
      this._dataChangeHandler(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointOfDayComponent && oldPointEditComponent) {
          replace(this._pointOfDayComponent, oldPointOfDayComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._pointOfDayComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointOfDayComponent && oldPointEditComponent) {
          remove(oldPointOfDayComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._escKeyDownHandler);
        render(this._container, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  /** Метод, который удаялет компоненты "Одна точка маршрута" и "Точка маршрута в режиме Edit" */
  destroy() {
    remove(this._pointOfDayComponent);
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  /** Метод, который возвращает Точку маршрута в дефолтное состояние */
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  /** Приватный метод, который заменяет Точку маршрута в режиме Default, на Точку маршрута в режиме Edit */
  _replacePointToEdit() {
    this._viewChangeHandler();
    replace(this._pointEditComponent, this._pointOfDayComponent);
    this._mode = Mode.EDIT;
  }

  /** Приватный метод, который заменяет Точку маршрута в режиме Edit, на Точку маршрута в режиме Default */
  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._pointEditComponent.reset();
    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointOfDayComponent, this._pointEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  /** Приватный метод, который устанавливает колбэк на нажатие кнопки Esc
   * @param {*} evt Событие, которое произошло
   */
  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._dataChangeHandler(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
