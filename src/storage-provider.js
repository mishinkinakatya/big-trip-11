import DataStorage from "./storage";

let storage = null;

export const getStorage = () => {
  if (storage) {
    return storage;
  } else {
    storage = new DataStorage();
    return storage;
  }
};
