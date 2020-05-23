import API from "./api.js";

const AUTHORIZATION = `Basic Zlrt59fjkco43dld4dkp`;

let api = null;

export const getApi = () => {
  if (api) {
    return api;
  } else {
    api = new API(AUTHORIZATION);
    return api;
  }
};
