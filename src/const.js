const POINT_ACTIVITY = {
  'check-in': `Check-in in`,
  'sightseeing': `Sightseeing in`,
  'restaurant': `Restaurant in`,
};

const POINT_TRANSPORT = {
  'taxi': `Taxi to`,
  'bus': `Bus to`,
  'train': `Train to`,
  'ship': `Ship to`,
  'transport': `Transport to`,
  'drive': `Drive to`,
  'flight': `Flight to`,
};

const ActionIcon = {
  'taxi': `🚕 TAXI`,
  'bus': `🚌 BUS`,
  'train': `🚂 TRAIN`,
  'ship': `🚢 SHIP`,
  'transport': `🚙 TRANSPORT`,
  'drive': `🚗 DRIVE`,
  'flight': `✈️ FLIGHT`,
  'check-in': `🏨 CHECK-IN`,
  'sightseeing': `🏛️ SIGHTSEEING`,
  'restaurant': `🍴 RESTAURANT`
};

const ALL_POINT_ACTION = Object.assign({}, POINT_TRANSPORT, POINT_ACTIVITY);

const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUNE`, `JULY`, `AUG`, `SEPT`, `OCT`, `NOV`, `DEC`];

const ButtonNames = {
  SAVE_DEFAULT: `Save`,
  DELETE_DEFAULT: `Delete`,
  SAVE_SENDING: `Saving...`,
  DELETE_SENDING: `Deleting...`,
  CANCEL: `Cancel`,
};

const FilterType = {
  EVERYTHING: `Everything`,
  FUTURE: `Future`,
  PAST: `Past`,
};

const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

const PointMode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const ChangePropertyType = {
  FROM_VIEW: `from-view`,
  FROM_MODEL: `from-model`,
};

const MenuItem = {
  TABLE: `table`,
  STATS: `stats`,
};

export {ActionIcon, ButtonNames, ALL_POINT_ACTION, ChangePropertyType, FilterType, MenuItem, MONTHS, PointMode, POINT_ACTIVITY, POINT_TRANSPORT, SortType};

