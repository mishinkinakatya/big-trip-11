import AbstractController from "./abstract-controller";
import TripDays from "../components/trip-days";

export default class PointsController extends AbstractController {
  constructor(container, model) {
    super(model);
    this._container = container;

    this._tripDays = new TripDays();

    this._rerender = this._rerender.bind(this);
    this.getModel().setActualPointsControllersChangeObserver(this._rerender);
  }

  render() {
    const points = this.getModel().getActualPoints();
    const sortType = this.getModel().getActiveSortType();
    this._tripDays.render(this._container, points, sortType);

  }

  _rerender() {
    this._tripDays.clearTripDays();
    this.render();
  }
}
