import Store from "./store.js";

const POINTS_STORE_NAME = `points-localstorage`;
const COMMON_STORE_PREFIX = `common-localstorage`;

let pointsStore = null;
let commonStore = null;

pointsStore = pointsStore ? pointsStore : pointsStore = new Store(POINTS_STORE_NAME, window.localStorage);
commonStore = commonStore ? commonStore : commonStore = new Store(COMMON_STORE_PREFIX, window.localStorage);

export const getPointsStore = () => pointsStore;
export const getCommonStore = () => commonStore;
