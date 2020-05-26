import {nanoid} from "nanoid";

const DESTINATIONS_KEY = `destinations`;
const OFFERS_KEY = `offers`;

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class DataManager {
  constructor(api, pointsStore, commonStore) {
    this._api = api;
    this._pointsStore = pointsStore;
    this._commonStore = commonStore;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points);

          this._pointsStore.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._pointsStore.getItems());
    return Promise.resolve(storePoints);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._commonStore.setItem(DESTINATIONS_KEY, destinations);
          return destinations;
        });
    }

    const storeDestinations = this._commonStore.getItem(DESTINATIONS_KEY);
    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._commonStore.setItem(OFFERS_KEY, offers);
          return offers;
        });
    }

    const storeOffers = this._commonStore.getItem(OFFERS_KEY);
    return Promise.resolve(storeOffers);
  }

  createPoint(pointData) {
    if (isOnline()) {
      return this._api.createPoint(pointData)
      .then((newPoint) => {
        this._pointsStore.setItem(newPoint.id, newPoint);

        return newPoint;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    }

    const newPointId = nanoid();
    const newPointData = Object.assign(pointData, {id: newPointId});
    this._pointsStore.setItem(newPointId, newPointData);
    return Promise.resolve(newPointData);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
      .then(() => this._pointsStore.removeItem(id))
      .catch((err) => {
        return Promise.reject(err);
      });
    }

    this._pointsStore.removeItem(id);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const pointsStore = Object.values(this._pointsStore.getItems());

      return this._api.sync(pointsStore)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._pointsStore.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  updatePoint(pointData, id) {
    if (isOnline()) {
      return this._api.updatePoint(pointData, id)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, newPoint);

          return newPoint;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    this._pointsStore.setItem(id, pointData);

    return Promise.resolve(this._pointsStore);
  }
}
