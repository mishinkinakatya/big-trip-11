import AbstractController from "./abstract-controller";
import StatsComponent from "../components/stats.js";
import {render, RenderPosition} from "../utils/render.js";

export default class StatsController extends AbstractController {
  constructor(container, model) {
    super(container, model);

    this._statsComponent = new StatsComponent(``, ``, ``);
  }

  activate() {
    const actualStats = this.getModel().getActualStats();
    this._statsComponent = new StatsComponent(actualStats.moneyStats, actualStats.transportStats, actualStats.timeSpendStats);

    render(this._container, this._statsComponent, RenderPosition.BEFOREEND);
    this._statsComponent.getMoneyChart();
    this._statsComponent.getTransportChart();
    this._statsComponent.getTimeSpendChart();
  }

  remove() {
    this._statsComponent.clear();
  }
}
