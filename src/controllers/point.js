import PointOfDayComponent from "../components/point-of-day.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";


const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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
  */
  render(point) {
    const oldPointOfDayComponent = this._pointOfDayComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointOfDayComponent = new PointOfDayComponent(point);
    this._pointEditComponent = new PointEditComponent(point);

    this._pointOfDayComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._pointEditComponent.setFavoriteChangeHandler(() => {
      this._dataChangeHandler(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    if (oldPointOfDayComponent && oldPointEditComponent) {
      replace(this._pointOfDayComponent, oldPointOfDayComponent);
      replace(this._pointEditComponent, oldPointEditComponent);
    } else {
      render(this._container, this._pointOfDayComponent, RenderPosition.BEFOREEND);
    }
  }

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
    replace(this._pointOfDayComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  /** Приватный метод, который устанавливает колбэк на нажатие кнопки Esc
   * @param {*} evt Событие, которое произошло
   */
  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
