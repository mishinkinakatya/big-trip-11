import AbstractController from "./abstract-controller";
import StatsComponent from "../components/stats.js";
import {render, RenderPosition} from "../utils/render.js";

export default class StatsController extends AbstractController {
  constructor(container, model) {
    super(model);
    this._container = container;

    this._statsComponent = new StatsComponent(``, ``, ``);

    this._rerender = this._rerender.bind(this);
    this.getModel().setStatsChangeObserver(this._rerender);
  }

  render() {
    render(this._container, this._statsComponent, RenderPosition.BEFOREEND);
  }

  hide() {
    this._statsComponent.hide();
  }

  show() {
    this._statsComponent.show();
  }

  _rerender(moneyStats, transportStats, timeSpendStats) {
    this._statsComponent.clearStats();
    this._statsComponent = new StatsComponent(moneyStats, transportStats, timeSpendStats);
    this.render();
  }
}
