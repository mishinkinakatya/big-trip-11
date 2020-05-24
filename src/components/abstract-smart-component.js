import AbstractComponent from "./abstract-component.js";

export default class AbstractSmartComponent extends AbstractComponent {
  constructor() {
    super();
    this._elementChangeObserves = [];
  }
  /** Метод, который восстанавливает слушателей */
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  /** Метод, который заменяет старый элемент на новый и навешивает на него обработчики */
  rerender(...theArgs) {
    const oldElement = this.getElement(...theArgs);
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement(...theArgs);

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
    this._callElementChangeObservers(oldElement, newElement);
  }

  setElementChangeObserver(handler) {
    this._elementChangeObserves.push(handler);
  }

  _callElementChangeObservers(oldElement, newElement) {
    this._elementChangeObserves.forEach((handler) => handler(oldElement, newElement));
  }
}
