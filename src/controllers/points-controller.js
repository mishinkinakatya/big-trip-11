import AbstractController from "./abstract-controller";
import {render, RenderPosition} from "../utils/render.js";
import NoPointsComponent from "../components/no-points.js";
import TripDays from "../components/trip-days";

export default class PointsController extends AbstractController {
  constructor(container, model) {
    super(model);
    this._container = container;
    this._noPointsComponent = new NoPointsComponent();
  }

  /**
   * Метод для рендеринга всех точек маршрута
   * @param {array} points Массив со всеми точками маршрута
   */
  render() {
    const points = this.getModel().getPointsAll();
    const isPoints = points.length === 0;

    if (isPoints) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    // render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    const tripDays = new TripDays();
    tripDays.render(this._container, points);

    // render(this._container, this._tripDays, RenderPosition.BEFOREEND);

    // const daysOfTrip = this._renderDaysOfTrip(this._getPointsDays());
    // this._daysOfTrip = this._daysOfTrip.concat(daysOfTrip);

    // const newPoints = this._renderPointsToDays(points);
    // this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }
}
