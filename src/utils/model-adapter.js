import {ALL_POINT_ACTION} from "../const.js";
import {getPointDurationInMs, getPointDurationInDHM} from "./common.js";
import {getStorage} from "../storage-provider.js";
import moment from "moment";

export const convertToClientModel = (inputModel) => {


  const serverProperties = [`base_price`, `date_from`, `date_to`, `destination`, `is_favorite`, `offers`, `type`];
  const isAllProperties = serverProperties.map((property) => {
    return inputModel.hasOwnProperty(property);
  });

  if (isAllProperties.some((result) => !result)) {
    return null;
  } else {
    const type = inputModel[`type`];
    const typeWithPreposition = `${ALL_POINT_ACTION[type]}`;
    const startDate = moment(inputModel[`date_from`]).format();
    const endDate = moment(inputModel[`date_to`]).format();
    const durationInMs = getPointDurationInMs(startDate, endDate);
    const offersFromServer = inputModel[`offers`];

    const availableOffers = getStorage().getAllOffers().find((item) => item.type === type).offers;

    const availableOffersWithCheck = availableOffers.map((offer) => Object.assign({}, offer, {
      isChecked: false,
    }));

    availableOffersWithCheck.forEach((availableOffer) => {
      offersFromServer.forEach((offer) => {
        if (availableOffer.title === offer.title && availableOffer.price === offer.price) {
          availableOffer.isChecked = true;
        }
      });
    });

    return {
      id: inputModel[`id`],
      description: inputModel[`destination`].description,
      destination: inputModel[`destination`].name,
      duration: getPointDurationInDHM(durationInMs),
      durationInMs,
      endDate,
      isFavorite: inputModel[`is_favorite`],
      offers: availableOffersWithCheck,
      photos: inputModel[`destination`].pictures,
      price: inputModel[`base_price`],
      startDate,
      type,
      typeWithPreposition,
    };
  }
};

export const convertToServerModel = (inputModel) => {
  const checkedOffers = inputModel.offers.filter((offer) => offer.isChecked);
  const offers = checkedOffers.length !== 0 ? checkedOffers.map((offer) => {
    return Object.assign({}, {
      "title": offer.title,
      "price": offer.price,
    });
  }) : [];

  return {
    "base_price": inputModel.price,
    "date_from": inputModel.startDate,
    "date_to": inputModel.endDate,
    "destination": {
      "description": inputModel.description,
      "name": inputModel.destination,
      "pictures": inputModel.photos || [],
    },
    "is_favorite": inputModel.isFavorite,
    "offers": offers,
    "type": inputModel.type,
  };
};
