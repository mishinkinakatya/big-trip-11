import AbstractController from "./abstract-controller";
import StatsComponent from "../components/stats.js";
import {render, RenderPosition} from "../utils/render.js";

export default class StatsController extends AbstractController {
  constructor(container, model) {
    super(container, model);

    this._statsComponent = new StatsComponent(``, ``, ``);

    this._rerender = this._rerender.bind(this);
    this.getModel().setStatsChangeObserver(this._rerender);
  }

  render() {
    render(this._container, this._statsComponent, RenderPosition.BEFOREEND);
    this._statsComponent.getMoneyChart();
    this._statsComponent.getTransportChart();
    this._statsComponent.getTimeSpendChart();
  }

  _rerender(moneyStats, transportStats, timeSpendStats) {
    this._statsComponent.clearStats();
    this._statsComponent = new StatsComponent(moneyStats, transportStats, timeSpendStats);
    this.render();
  }
}
