export const EVENT_STATION = [
  `Check`,
  `Sightseeing`,
  `Restaurant`,
];

export const EVENT_MOTION = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
];

export const EVENT_POINT = EVENT_MOTION.concat(EVENT_STATION);

export const EVENT_DESTINATION = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
];

export const priceToOffer = {
  'Order Uber': `20`,
  'Add luggage': `30`,
  'Switch to comfort class': `100`,
  'Add meal': `15`,
  'Choose seats': `5`,
  'Travel by train': `40`,
  'Rent a car': `200`,
  'Add breakfast': `50`,
  'Book tickets': `40`,
  'Lunch in city': `30`,
};
