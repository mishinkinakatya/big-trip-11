import {getPointsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

/** Модель: "Точки маршрута" */
export default class Points {
  /**
   * Свойства модели "Точки маршрута"
   * @property {*} this._points - Массив со всеми точками маршрута
   * @property {*} this._activeFilterType - Значение активного (выбранного) фильтра
   * @property {*} this._dataChangeHandler - Массив со всеми контроллерами "Точка маршрута", которые следят за изменением модели
   * @property {*} this._filterChangeHandlers - Массив со всеми контроллерами "Точка маршрута", которые следят за изменением типа фильтра
   */
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  /** @return {*} Метод, который возвращает точки маршрута, соответствующие выбранному фильтру */
  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  /** @return {*} Метод, который возвращает все точки маршрута */
  getPointsAll() {
    return this._points;
  }

  /**
   * Метод, который записывает точки маршрута
   * @param {*} points Массив точек маршрута
   */
  setPoints(points) {
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }

  /**
   * @return {*} Метод, который обновляет точку маршрута
   * @param {*} id Id точки маршрута, которая изменилась
   * @param {*} point Точка маршрута
   */
  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  /**
   * Метод, который устанавливает активный фильтр и уведомляет наблюдателей, что тип фильтра изменился
   * @param {*} filterType Выбранный тип фильтра
   */
  setFilterType(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  /**
 * Метод, который устанавливает колбэк, который будет вызывать модель, если изменился фильтр
 * @param {*} handler Колбэк для клика по кнопке Save
 */
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  /**
   * Метод, который устанавливает колбэк, который будет вызывать модель, если она изменилась
   * @param {*} handler Колбэк для клика по кнопке Save
   */
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  /**
   * Приватный метод, для вызова установленных колбэков
   * @param {*} handlers Массив со всеми колбэками
   */
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
