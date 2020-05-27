import API from "./api.js";

const AUTHORIZATION = `Basic Zlrt59fjkco43dld4dkp`;

let api = null;

api = api ? api : new API(AUTHORIZATION);

export const getApi = () => api;
