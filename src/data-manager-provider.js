import DataManager from "./data-manager.js";
import {getApi} from "./api-provider.js";
import {getPointsStore, getCommonStore} from "./store-provider.js";

let dataManager = null;

dataManager = dataManager ? dataManager : new DataManager(getApi(), getPointsStore(), getCommonStore());

export const getDataManager = () => dataManager;
