import AbstractComponent from "./abstract-component.js";
import {MenuItem} from "../const.js";

const ACTIVE_BUTTON_CLASS = `trip-tabs__btn--active`;

const createSiteMenuTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item ="${MenuItem.TABLE}">Table</a>
    <a class="trip-tabs__btn" href="#" data-menu-item ="${MenuItem.STATS}">Stats</a>
  </nav>`;

export default class SiteMenu extends AbstractComponent {
  constructor() {
    super();

    this._activeMenuItem = MenuItem.TABLE;
    this._activeElement = this.getElement().firstElementChild;
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuItemChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.dataset.menuItem;

      if (this._activeMenuItem === menuItem) {
        return;
      }

      this._activeElement.classList.remove(ACTIVE_BUTTON_CLASS);
      this._activeElement = evt.target;
      this._activeElement.classList.add(ACTIVE_BUTTON_CLASS);

      this._activeMenuItem = menuItem;

      handler(this._activeMenuItem);
    });

  }
}
