import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import CreateFormView from '../view/create-form-view.js';
import {render, RenderPosition, replace} from '../framework/render.js';

export default class BoardPresenter {
  pointListComponent = new PointListView();

  constructor({boardContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    const points = this.pointsModel.getPoints();
    const destinations = this.pointsModel.getDestinations();
    const offersByType = this.pointsModel.getOffersByType();

    render(new SortView(), this.boardContainer);

    // Форма создания (первое окно) — над списком
    render(new CreateFormView(), this.boardContainer);

    render(this.pointListComponent, this.boardContainer);

    const POINTS_TO_RENDER = 5;

    for (let i = 0; i < Math.min(points.length, POINTS_TO_RENDER); i++) {
      this.#renderPoint(points[i], destinations, offersByType);
    }
  }

  #renderPoint(point, destinations, offersByType) {
    const destination = destinations.find(
      (item) => item.id === point.destinationId,
    );
    const offersOfType = offersByType.find(
      (offer) => offer.type === point.type,
    ).offers;
    const selectedOffers = offersOfType.filter((offer) =>
      point.offers.includes(offer.id),
    );

    const pointListElement = this.pointListComponent.element;
    const listItem = document.createElement('li');
    listItem.classList.add('trip-events__item');
    pointListElement.append(listItem);

    let pointComponent = null;
    let editFormComponent = null;

    const escKeyDownHandler = (evt) => {
      if (evt.key !== 'Escape') {
        return;
      }

      evt.preventDefault();

      replace(pointComponent, editFormComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    pointComponent = new PointView({
      point,
      destination,
      offers: selectedOffers,
      onEditClick: () => {
        replace(editFormComponent, pointComponent);
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    editFormComponent = new EditFormView({
      point,
      destination,
      offers: offersOfType,
      destinations,
      onFormSubmit: () => {
        replace(pointComponent, editFormComponent);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onRollupClick: () => {
        replace(pointComponent, editFormComponent);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    render(pointComponent, listItem, RenderPosition.BEFOREEND);
  }
}

