import AbstractComponent from "./abstract-component";
import {ActionIcon} from "../const";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getPointDurationInDHM} from "../utils/common.js";
import {remove} from "../utils/render.js";

const BAR_HEIGHT = 55;
const MIN_BLOCK_HEIGHT = 4;

const createLabels = (types) => {
  const actualTypes = Object.keys(types);
  return {
    type: actualTypes.map((type) => ActionIcon[type]),
    height: actualTypes.length >= 3 ? BAR_HEIGHT * actualTypes.length : BAR_HEIGHT * MIN_BLOCK_HEIGHT,
  };
};

const createMoneyChart = (moneyStats) => {
  const moneyCtx = document.querySelector(`.statistics__chart--money`);
  moneyCtx.height = createLabels(moneyStats).height;

  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: createLabels(moneyStats).type,
      datasets: [{
        data: Object.values(moneyStats),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  return moneyChart;
};

const createTransportChart = (transportStats) => {
  const transportCtx = document.querySelector(`.statistics__chart--transport`);
  transportCtx.height = createLabels(transportStats).height;

  const transportChart = new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: createLabels(transportStats).type,
      datasets: [{
        data: Object.values(transportStats),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  return transportChart;
};

const createTimeSpendChart = (timeSpendStats) => {
  const timeSpendCtx = document.querySelector(`.statistics__chart--time`);
  timeSpendCtx.height = createLabels(timeSpendStats).height;

  const timeSpendChart = new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: createLabels(timeSpendStats).type,
      datasets: [{
        data: Object.values(timeSpendStats),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${getPointDurationInDHM(val)}`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  return timeSpendChart;
};

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
    return createStatsTemplate();
  }

  getMoneyChart() {
    return (createMoneyChart(this._moneyStats));
  }

  getTransportChart() {
    return (createTransportChart(this._transportStats));
  }

  getTimeSpendChart() {
    return (createTimeSpendChart(this._timeSpendStats));
  }

  clearStats() {
    remove(this);
  }
}
