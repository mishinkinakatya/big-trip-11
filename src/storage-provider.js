import DataStorage from "./storage";

let storage = null;

storage = storage ? storage : storage = new DataStorage();

export const getStorage = () => storage;

