const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const basicUrls = {
  COMMON: `https://11.ecmascript.pages.academy/big-trip`,
};

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({
      baseUrl: basicUrls.COMMON,
      addingUrl: `points`
    })
      .then((response) => response.json());
  }

  getDestinations() {
    return this._load({
      baseUrl: basicUrls.COMMON,
      addingUrl: `destinations`
    })
      .then((response) => response.json());
  }

  getOffers() {
    return this._load({
      baseUrl: basicUrls.COMMON,
      addingUrl: `offers`
    })
      .then((response) => response.json());
  }

  createPoint(pointData) {
    return this._load({
      baseUrl: basicUrls.COMMON,
      addingUrl: `points`,
      method: Method.POST,
      body: JSON.stringify(pointData),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  deletePoint(id) {
    return this._load({
      baseUrl: basicUrls.COMMON,
      addingUrl: `points/${id}`,
      method: Method.DELETE
    });
  }

  updatePoint(pointData, id) {
    return this._load({
      baseUrl: basicUrls.COMMON,
      addingUrl: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(pointData),
      headers: new Headers({"Content-Type": `application/json`})
    });
  }

  // базовый метод на отправку запросов
  _load({baseUrl, addingUrl, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${baseUrl}/${addingUrl}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
