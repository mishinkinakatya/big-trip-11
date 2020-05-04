const ALL_DESTINATION = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Saint Petersburg`,
];

const ALL_DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const POINT_ACTIVITY = {
  'check-in': `Check-in`,
  'sightseeing': `Sightseeing`,
  'restaurant': `Restaurant`,
};

const POINT_TRANSPORT = {
  'taxi': `Taxi`,
  'bus': `Bus`,
  'train': `Train`,
  'ship': `Ship`,
  'transport': `Transport`,
  'drive': `Drive`,
  'flight': `Flight`,
};

const ALL_POINT_ACTION = Object.assign(POINT_TRANSPORT, POINT_ACTIVITY);


// TODO!!! Научиться генерировать массив из имеющихся данных
const POINT_ACTION_WITH_OFFERS = [
  {
    pointType: `taxi`,
    offerType: `Order Uber`,
    offerPrice: `20`,
  },
  {
    pointType: `bus`,
    offerType: `Add luggage`,
    offerPrice: `30`,
  },
  {
    pointType: `bus`,
    offerType: `Add meal`,
    offerPrice: `15`,
  },
  {
    pointType: `bus`,
    offerType: `Choose seats`,
    offerPrice: `5`,
  },
  {
    pointType: `train`,
    offerType: `Travel by train`,
    offerPrice: `40`,
  },
  {
    pointType: `train`,
    offerType: `Add luggage`,
    offerPrice: `30`,
  },
  {
    pointType: `train`,
    offerType: `Add meal`,
    offerPrice: `15`,
  },
  {
    pointType: `train`,
    offerType: `Choose seats`,
    offerPrice: `5`,
  },
  {
    pointType: `ship`,
    offerType: `Add luggage`,
    offerPrice: `30`,
  },
  {
    pointType: `ship`,
    offerType: `Add meal`,
    offerPrice: `15`,
  },
  {
    pointType: `ship`,
    offerType: `Choose seats`,
    offerPrice: `5`,
  },
  {
    pointType: `transport`,
    offerType: `Rent a car`,
    offerPrice: `200`,
  },
  {
    pointType: `drive`,
    offerType: `Rent a car`,
    offerPrice: `200`,
  },
  {
    pointType: `flight`,
    offerType: `Switch to comfort class`,
    offerPrice: `100`,
  },
  {
    pointType: `flight`,
    offerType: `Add luggage`,
    offerPrice: `30`,
  },
  {
    pointType: `flight`,
    offerType: `Add meal`,
    offerPrice: `15`,
  },
  {
    pointType: `flight`,
    offerType: `Choose seats`,
    offerPrice: `5`,
  },
  {
    pointType: `check-in`,
    offerType: `Add breakfast`,
    offerPrice: `50`,
  },
  {
    pointType: `sightseeing`,
    offerType: `Book tickets`,
    offerPrice: `40`,
  },
  {
    pointType: `sightseeing`,
    offerType: `Lunch in city`,
    offerPrice: `30`,
  },
  {
    pointType: `restaurant`,
    offerType: `Choose seats`,
    offerPrice: `5`,
  },
];

const MONTH = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUNE`, `JULY`, `AUG`, `SEPT`, `OCT`, `NOV`, `DEC`];

export {POINT_ACTIVITY, POINT_TRANSPORT, ALL_DESCRIPTION, ALL_DESTINATION, POINT_ACTION_WITH_OFFERS, MONTH, ALL_POINT_ACTION};

