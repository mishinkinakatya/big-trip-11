import PointOfDayComponent from "../components/point-of-day.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";

/** Контроллер: "Точка маршрута" */
export default class PointController {
  /**
   * Свойства контроллера "Точка маршрута"
   * @property {*} this._container - Компонент, внутри которого будет рендериться точка маршрута
   * @property {*} this._pointOfDayComponent - Компонент "Одна точка маршрута"
   * @property {*} this._pointEditComponent - Компонент "Точка маршрута в режиме Edit"
   * @property {*} this._escKeyDownHandler - Метод, который устанавливает колбэк на нажатие кнопки Esc
   * @param {*} container Компонент, внутри которого будет рендериться точка маршрута
   */
  constructor(container) {
    this._container = container;

    this._pointOfDayComponent = null;
    this._pointEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  /**
  * Метод для рендеринга точки маршрута
  * @param {object} point Объект, который описывает свойства одной точки маршрута
  */
  render(point) {
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

    render(this._container, this._pointOfDayComponent, RenderPosition.BEFOREEND);
  }

  /** Приватный метод, который заменяет Точку маршрута в режиме Default, на Точку маршрута в режиме Edit */
  _replacePointToEdit() {
    replace(this._pointEditComponent, this._pointOfDayComponent);
  }

  /** Приватный метод, который заменяет Точку маршрута в режиме Edit, на Точку маршрута в режиме Default */
  _replaceEditToPoint() {
    replace(this._pointOfDayComponent, this._pointEditComponent);
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
