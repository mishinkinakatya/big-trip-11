import DataStorage from "./storage.js";

let storage = storage ? storage : storage = new DataStorage();

export const getStorage = () => storage;

