export default class AbstractController {
  constructor(model) {
    this._model = model;
  }

  getModel() {
    if (!this._model) {
      throw new Error(`Model bad.`);
    }
    return this._model;
  }
}
