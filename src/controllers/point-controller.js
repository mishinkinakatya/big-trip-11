import AbstractController from "./abstract-controller.js";
import PointEditComponent from "../components/point-edit.js";
import PointOfDayComponent from "../components/point-of-day.js";
import {ChangePropertyType, PointMode} from "../const.js";
import {getApi} from "../api-provider.js";
import {convertToClientModel, convertToServerModel} from "../utils/model-adapter.js";
const SHAKE_ANIMATION_TIMEOUT = 600;

export default class PointController extends AbstractController {
  constructor(model) {
    super(null, model);

    this._updateTempPoint = this._updateTempPoint.bind(this);
    this._getActualPointData = this._getActualPointData.bind(this);
    this._getTempPointData = this._getTempPointData.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._api = getApi();

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
    const pointEditComponent = new PointEditComponent(this.getModel().getMode(), this._getActualPointData, this._updateTempPoint, this._getTempPointData);

    const handleTheError = () => {
      pointEditComponent.rerender(false);
      this._shake(pointEditComponent);
    };

    pointEditComponent.setElementChangeObserver((_, newElement) => {
      this.setView(newElement);
    });
    pointEditComponent.setSubmitHandler(() => {
      const tempPoint = this.getModel().getTempPoint();

      if (tempPoint.destination === ``) {
        pointEditComponent.getElement().querySelector(`.event__input--destination`).setCustomValidity(`Destinaton must be indicated`);
        return;
      }

      if (tempPoint.price === ``) {
        pointEditComponent.getElement().querySelector(`.event__input--price`).setCustomValidity(`Price must be indicated`);
        return;
      }

      const changeModel = () => {
        this.getModel().applyChanges();
        this.getModel().setMode(PointMode.DEFAULT, ChangePropertyType.FROM_VIEW);
        this.initView();
        pointEditComponent.removeElement();
        document.removeEventListener(`keydown`, this._escKeyDownHandler);
      };

      pointEditComponent.rerender(true);

      if (this.getModel().getMode() === PointMode.ADDING) {
        this._api.createPoint(convertToServerModel(tempPoint))
          .then((pointData) => {
            this.getModel().updateTempPoint(convertToClientModel(pointData));
            changeModel();
          })
          .catch(() => {
            handleTheError();
          });
      } else if (this.getModel().getMode() === PointMode.EDIT) {
        this._api.updatePoint(convertToServerModel(tempPoint), tempPoint.id)
          .then(() => {
            changeModel();
          })
          .catch(() => {
            handleTheError();
          });
      }
    });
    pointEditComponent.setResetButtonClickHandler(() => {

      pointEditComponent.rerender(true);

      if (this.getModel().getMode() === PointMode.ADDING) {
        this.getModel().removePoint();
      } else if (this.getModel().getMode() === PointMode.EDIT) {
        this._api.deletePoint(this.getModel().getTempPoint().id)
          .then(() => {
            this.getModel().removePoint();
            pointEditComponent.removeElement();
          })
          .catch(() => {
            handleTheError();
          });
      }
    });

    pointEditComponent.setRollupButtonClickHandler(() => {
      this._resetChanges();
    });

    return pointEditComponent;
  }

  _getActualPointData() {
    return this.getModel().getActualPoint();
  }

  _getTempPointData() {
    return this.getModel().getTempPoint();
  }

  _resetChanges() {
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

  _shake(component) {
    component.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      component.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _updateTempPoint(tempPoint) {
    return this.getModel().updateTempPoint(tempPoint);
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      this._resetChanges();
    }
  }
}
