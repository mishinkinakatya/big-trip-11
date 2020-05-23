import AbstractComponent from "./abstract-component";
import {getPointDurationInDHM} from "../utils/common.js";
import {remove} from "../utils/render.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;
const MIN_BLOCK_HEIGHT = 4;

const createLabels = (types) => {
  return {
    type: Object.keys(types).map((type) => type.toUpperCase()),
    // type: Object.keys(types).map((type) => {
    //   const image = new Image();
    //   image.src = `img/icons/${type}.png`;
    //   const resultView = image + `` + type.toUpperCase();
    //   return resultView;
    // }),
    height: types.length >= 3 ? BAR_HEIGHT * types.length : BAR_HEIGHT * MIN_BLOCK_HEIGHT,
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
        data: Object.values(moneyStats).sort((a, b) => b - a),
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
        data: Object.values(transportStats).sort((a, b) => b - a),
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
        data: Object.values(timeSpendStats).sort((a, b) => b - a),
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
  `<div>
    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </div>`;

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
