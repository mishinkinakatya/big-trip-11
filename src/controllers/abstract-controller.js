export default class AbstractController {
  constructor(model) {
    this._model = model;
    this._view = null;
    this._oldView = null;
    this._viewChangeObserves = [];
  }

  getModel() {
    if (!this._model) {
      throw new Error(`Model not initialized`);
    }
    return this._model;
  }

  buildView() {
    throw new Error(`Not implemented 'buildView' method`);
  }

  initView() {
    this._oldView = this._view;
    this._view = this.buildView();
    this._callViewChangeObservers();
  }

  getView() {
    if (this._view === null) {
      this._view = this.buildView();
    }
    if (this._view === null) {
      throw new Error(`View not initialized`);
    }
    return this._view;
  }

  setView(view) {
    this._oldView = this._view;
    this._view = view;
    this._callViewChangeObservers();
  }

  setViewChangeObserver(handler) {
    this._viewChangeObserves.push(handler);
  }

  _callViewChangeObservers() {
    this._viewChangeObserves.forEach((handler) => handler(this._view, this._oldView));
  }
}
