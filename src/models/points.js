/** Модель: "Точки маршрута" */
export default class Points {
  /**
   * Свойства модели "Точки маршрута"
   * @property {*} this._points - Массив со всеми точками маршрута
   * @property {*} this._dataChangeHandler - Массив со всеми показанынми контроллерами "Точка маршрута"
   */
  constructor() {
    this._points = [];

    this._dataChangeHandlers = [];
  }

  /** @return {*} Метод, который возвращает все точки маршрута */
  getPoints() {
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
