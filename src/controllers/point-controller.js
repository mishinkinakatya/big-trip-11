import AbstractController from "./abstract-controller.js";
import PointEditComponent from "../components/point-edit.js";
import PointOfDayComponent from "../components/point-of-day.js";
import {ChangePropertyType, ButtonNames, PointMode} from "../const.js";
import {convertToClientModel, convertToServerModel} from "../utils/model-adapter.js";
import {getDataManager} from "../data-manager-provider.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class PointController extends AbstractController {
  constructor(model) {
    super(null, model);

    this._updateTempPoint = this._updateTempPoint.bind(this);
    this._getActualPointData = this._getActualPointData.bind(this);
    this._getTempPointData = this._getTempPointData.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._dataManager = getDataManager();

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


    const changeModel = () => {
      this.getModel().applyChanges();
      this.getModel().setMode(PointMode.DEFAULT, ChangePropertyType.FROM_VIEW);
      this.initView();
      pointEditComponent.removeElement();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    };

    const handleTheError = (buttonName) => {
      pointEditComponent.rerender(false, buttonName);
      this._shake(pointEditComponent);
    };

    pointEditComponent.setElementChangeObserver((_, newElement) => {
      this.setView(newElement);
    });

    pointEditComponent.setSubmitHandler((evt) => {
      const tempPoint = this.getModel().getTempPoint();
      if (tempPoint.destination === ``) {
        pointEditComponent.returnValidatedFields().destination.setCustomValidity(`Destinaton must be indicated`);
        return;
      }

      if (tempPoint.price === ``) {
        pointEditComponent.returnValidatedFields().price.setCustomValidity(`Price must be indicated`);
        return;
      }

      if (tempPoint.price < 0) {
        pointEditComponent.returnValidatedFields().price.setCustomValidity(`Price must be positive integer number`);
        return;
      }
      evt.preventDefault();

      pointEditComponent.rerender(true, ButtonNames.SAVE_DEFAULT);

      if (this.getModel().getMode() === PointMode.ADDING) {
        this._dataManager.createPoint(convertToServerModel(tempPoint))
          .then((pointData) => {
            this.getModel().updateTempPoint(convertToClientModel(pointData));
            changeModel();
          })
          .catch(() => {
            handleTheError(ButtonNames.SAVE_DEFAULT);
          });
      } else if (this.getModel().getMode() === PointMode.EDIT) {
        this._dataManager.updatePoint(convertToServerModel(tempPoint), tempPoint.id)
          .then(() => {
            changeModel();
          })
          .catch(() => {
            handleTheError(ButtonNames.SAVE_DEFAULT);
          });
      }
    });

    pointEditComponent.setResetButtonClickHandler(() => {
      pointEditComponent.rerender(true, ButtonNames.DELETE_DEFAULT);

      if (this.getModel().getMode() === PointMode.ADDING) {
        this.getModel().removePoint();
      } else if (this.getModel().getMode() === PointMode.EDIT) {
        this._dataManager.deletePoint(this.getModel().getTempPoint().id)
          .then(() => {
            this.getModel().removePoint();
            pointEditComponent.removeElement();
          })
          .catch(() => {
            handleTheError(ButtonNames.DELETE_DEFAULT);
          });
      }
    });

    pointEditComponent.setRollupButtonClickHandler(() => {
      this._reset();
    });

    pointEditComponent.setFavoriteButtonClickHandler(() => {
      const tempPoint = this.getModel().getTempPoint();
      tempPoint.isFavorite = !tempPoint.isFavorite;

      if (this.getModel().getMode() === PointMode.ADDING) {
        this.getModel().updateTempPoint(tempPoint);
      } else if (this.getModel().getMode() === PointMode.EDIT) {
        this._dataManager.updatePoint(convertToServerModel(tempPoint), tempPoint.id)
          .then(() => {
            this.getModel().updateTempPoint(tempPoint);
            this.getModel().applyChanges();
            this.initView();
          })
          .catch(() => {
            handleTheError(ButtonNames.SAVE_DEFAULT);
          });
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

  _reset() {
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
      this._reset();
    }
  }
}
