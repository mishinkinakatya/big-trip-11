import DataStorage from "./storage.js";

let storage = null;

storage = storage ? storage : storage = new DataStorage();

export const getStorage = () => storage;

