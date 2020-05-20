import AbstractComponent from "./abstract-component";
import {remove} from "../utils/render.js";

const createStatsTemplate = () =>
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;

export default class Stats extends AbstractComponent {
  constructor(moneyStats, transportStats, timeSpendStats) {
    super();
    this._moneyStats = moneyStats;
    this._transportStats = transportStats;
    this._timeSpendStats = timeSpendStats;
  }

  getTemplate() {
    return createStatsTemplate(this._moneyStats, this._transportStats, this._timeSpendStats);
  }

  clearStats() {
    remove(this);
  }
}
