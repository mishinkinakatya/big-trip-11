import AbstractController from "./abstract-controller.js";
import PointEditComponent from "../components/point-edit.js";
import PointOfDayComponent from "../components/point-of-day.js";
import {ChangePropertyType, PointMode} from "../const.js";

export default class PointController extends AbstractController {
  constructor(model) {
    super(model);

    this._updateTempPoint = this._updateTempPoint.bind(this);
    this._getActualPointData = this._getActualPointData.bind(this);
    this._getTempPointData = this._getTempPointData.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this.getModel().setModeChangeObserver((_, changePropertyType) => {
      if (changePropertyType === ChangePropertyType.FROM_MODEL) {
        this.initView();
      }
    });
  }

  buildView() {
    const mode = this.getModel().getMode();
    switch (mode) {
      case PointMode.DEFAULT:
        return this._createPointOfDayComponent().getElement();
      case PointMode.EDIT:
      case PointMode.ADDING:
        document.addEventListener(`keydown`, this._escKeyDownHandler);
        return this._createPointEditComponent().getElement();
      default:
        return new Error(`Unknown point mode`);
    }
  }

  _createPointOfDayComponent() {
    const pointOfDayComponent = new PointOfDayComponent(this._getActualPointData());
    pointOfDayComponent.setEditButtonClickHandler(() => {
      this.getModel().setMode(PointMode.EDIT, ChangePropertyType.FROM_VIEW);
      this.initView();
    });

    return pointOfDayComponent;
  }

  _createPointEditComponent() {
    const pointEditComponent = new PointEditComponent(this._getActualPointData, this._updateTempPoint, this._getTempPointData);
    pointEditComponent.setElementChangeObserver((_, newElement) => {
      this.setView(newElement);
    });
    pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this.getModel().applyChanges();
      this.getModel().setMode(PointMode.DEFAULT, ChangePropertyType.FROM_VIEW);
      this.initView();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });
    pointEditComponent.setResetButtonClickHandler(() => {
      const model = this.getModel();
      if (model.isInit()) {
        model.resetChanges();
        model.setMode(PointMode.DEFAULT, ChangePropertyType.FROM_VIEW);
        this.initView();
      } else {
        model.removePoint();
      }
    });

    return pointEditComponent;
  }

  _getActualPointData() {
    return this.getModel().getActualPoint();
  }

  _getTempPointData() {
    return this.getModel().getTempPoint();
  }

  _updateTempPoint(tempPoint) {
    return this.getModel().updateTempPoint(tempPoint);
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      const model = this.getModel();
      if (model.isInit()) {
        model.resetChanges();
        model.setMode(PointMode.DEFAULT, ChangePropertyType.FROM_VIEW);
        this.initView();
      } else {
        model.removePoint();
      }
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
