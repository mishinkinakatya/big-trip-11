const COMMON_URL = `https://11.ecmascript.pages.academy/big-trip`;

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const StatusCode = {
  OK: 200,
  REDIRECT: 300,
};

const checkStatus = (response) => {
  if (response.status >= StatusCode.OK && response.status < StatusCode.REDIRECT) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({
      baseUrl: COMMON_URL,
      addingUrl: `points`
    })
      .then((response) => response.json());
  }

  getDestinations() {
    return this._load({
      baseUrl: COMMON_URL,
      addingUrl: `destinations`
    })
      .then((response) => response.json());
  }

  getOffers() {
    return this._load({
      baseUrl: COMMON_URL,
      addingUrl: `offers`
    })
      .then((response) => response.json());
  }

  createPoint(pointData) {
    return this._load({
      baseUrl: COMMON_URL,
      addingUrl: `points`,
      method: Method.POST,
      body: JSON.stringify(pointData),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  deletePoint(id) {
    return this._load({
      baseUrl: COMMON_URL,
      addingUrl: `points/${id}`,
      method: Method.DELETE
    });
  }

  sync(points) {
    return this._load({
      baseUrl: COMMON_URL,
      addingUrl: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(points),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  updatePoint(pointData, id) {
    return this._load({
      baseUrl: COMMON_URL,
      addingUrl: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(pointData),
      headers: new Headers({"Content-Type": `application/json`})
    });
  }

  _load({baseUrl, addingUrl, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${baseUrl}/${addingUrl}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
