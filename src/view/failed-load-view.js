import AbstractView from '../framework/view/abstract-view.js';
import {FAILED_LOAD_MESSAGE} from '../const.js';

const createFailedLoadTemplate = () =>
  `<p class="trip-events__msg">${FAILED_LOAD_MESSAGE}</p>`;

export default class FailedLoadView extends AbstractView {
  get template() {
    return createFailedLoadTemplate();
  }
}
