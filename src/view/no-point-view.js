import AbstractView from '../framework/view/abstract-view.js';
import {EMPTY_LIST_MESSAGE} from '../const.js';

const createNoPointTemplate = (filterType) =>
  `<p class="trip-events__msg">${EMPTY_LIST_MESSAGE[filterType]}</p>`;

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
