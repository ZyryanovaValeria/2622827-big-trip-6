import TripInfoView from '../view/trip-info-view.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {getRouteTitle, getTripDates, getTripTotalCost} from '../utils/trip-info.js';

export default class TripInfoPresenter {
  #tripMainContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({tripMainContainer, pointsModel}) {
    this.#tripMainContainer = tripMainContainer;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderTripInfo();
  }

  #destroyTripInfo() {
    if (this.#tripInfoComponent !== null) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }

    this.#tripMainContainer.querySelector('.trip-main__trip-info')?.remove();
  }

  #renderTripInfo() {
    const points = this.#pointsModel.getPoints();

    if (points.length === 0) {
      this.#destroyTripInfo();
      return;
    }

    const destinations = this.#pointsModel.getDestinations();
    const offersByType = this.#pointsModel.getOffersByType();
    const route = getRouteTitle(points, destinations);
    const dates = getTripDates(points);
    const cost = getTripTotalCost(points, offersByType);
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({route, dates, cost});

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelChange = () => {
    this.#renderTripInfo();
  };
}
