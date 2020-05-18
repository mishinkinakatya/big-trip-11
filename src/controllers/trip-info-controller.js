import AbstractController from "./abstract-controller.js";
import TripInfoComponent from "../components/trip-info.js";
import {render, RenderPosition} from "../utils/render.js";

export default class TripInfoController extends AbstractController {
  constructor(container, model) {
    super(model);
    this._container = container;

    this._tripInfoComponent = new TripInfoComponent(``, ``, ``);

    this._rerender = this._rerender.bind(this);
    this.getModel().setTripInfoChangeObserver(this._rerender);
  }

  render() {
    render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _rerender(tripInfo) {
    this._tripInfoComponent.clearTripInfo();
    this._tripInfoComponent = new TripInfoComponent(tripInfo.title, tripInfo.dates, tripInfo.coast);
    this.render();
  }
}
