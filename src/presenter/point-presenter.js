import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {render, replace, remove} from '../framework/render.js';
import {USER_ACTIONS} from '../const.js';

const SAVE_BUTTON_DEFAULT_TEXT = 'Save';
const SAVE_BUTTON_SAVING_TEXT = 'Saving...';
const DELETE_BUTTON_DEFAULT_TEXT = 'Delete';
const DELETE_BUTTON_DELETING_TEXT = 'Deleting...';

export default class PointPresenter {
  #pointListContainer = null;
  #point = null;
  #destinations = null;
  #offersByType = null;
  #onPointChange = null;
  #onBeforeEdit = null;
  #uiBlocker = null;

  #pointComponent = null;
  #editFormComponent = null;
  #isPointMode = true;

  constructor({
    pointListContainer,
    point,
    destinations,
    offersByType,
    onPointChange,
    onBeforeEdit,
    uiBlocker,
  }) {
    this.#pointListContainer = pointListContainer;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#onPointChange = onPointChange;
    this.#onBeforeEdit = onBeforeEdit;
    this.#uiBlocker = uiBlocker;
  }

  get pointId() {
    return this.#point.id;
  }

  init() {
    this.#renderPoint();
    render(this.#pointComponent, this.#pointListContainer);
  }

  #getDestination() {
    return this.#destinations.find(
      (item) => item.id === this.#point.destinationId,
    );
  }

  #getSelectedOffers() {
    const offersOfType = this.#offersByType.find(
      (offer) => offer.type === this.#point.type,
    )?.offers ?? [];

    return offersOfType.filter((offer) =>
      this.#point.offers.includes(offer.id),
    );
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editFormComponent.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
      this.#editFormComponent.setDeleteButtonText(DELETE_BUTTON_DEFAULT_TEXT);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    this.#onBeforeEdit();
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#isPointMode = false;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isPointMode = true;
  };

  #handleFormSubmit = async (updatedPoint) => {
    const editForm = this.#editFormComponent;
    editForm.setSaveButtonText(SAVE_BUTTON_SAVING_TEXT);
    this.#uiBlocker.block();

    try {
      await this.#onPointChange(USER_ACTIONS.UPDATE_POINT, updatedPoint);
      editForm.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
      this.#replaceFormToPoint();
    } catch {
      editForm.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
      editForm.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleRollupClick = async (updatedPoint) => {
    const editForm = this.#editFormComponent;
    this.#uiBlocker.block();

    try {
      await this.#onPointChange(USER_ACTIONS.UPDATE_POINT, updatedPoint);
      this.#replaceFormToPoint();
    } catch {
      editForm.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleFavoriteClick = async (updatedPoint) => {
    this.#uiBlocker.block();

    try {
      await this.#onPointChange(USER_ACTIONS.UPDATE_POINT, updatedPoint);
    } catch {
      this.#pointComponent.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleDeleteClick = async (point) => {
    const editForm = this.#editFormComponent;
    editForm.setDeleteButtonText(DELETE_BUTTON_DELETING_TEXT);
    this.#uiBlocker.block();

    try {
      await this.#onPointChange(USER_ACTIONS.DELETE_POINT, point);
    } catch {
      editForm.setDeleteButtonText(DELETE_BUTTON_DEFAULT_TEXT);
      editForm.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #createPointComponent() {
    const destination = this.#getDestination();
    const selectedOffers = this.#getSelectedOffers();

    return new PointView({
      point: this.#point,
      destination,
      offers: selectedOffers,
      onEditClick: this.#replacePointToForm,
      onFavoriteClick: this.#handleFavoriteClick,
    });
  }

  #createEditFormComponent() {
    return new EditFormView({
      point: this.#point,
      destinations: this.#destinations,
      offersByType: this.#offersByType,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      onDeleteClick: this.#handleDeleteClick,
    });
  }

  #renderPoint() {
    this.#pointComponent = this.#createPointComponent();
    this.#editFormComponent = this.#createEditFormComponent();
  }

  resetView() {
    if (this.#isPointMode) {
      return;
    }

    this.#editFormComponent.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
    this.#editFormComponent.setDeleteButtonText(DELETE_BUTTON_DEFAULT_TEXT);
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isPointMode = true;
  }

  update(updatedPoint) {
    this.#point = updatedPoint;

    if (!this.#isPointMode) {
      const oldEditForm = this.#editFormComponent;
      this.#editFormComponent = this.#createEditFormComponent();
      replace(this.#editFormComponent, oldEditForm);
      this.#pointComponent = this.#createPointComponent();
      return;
    }

    const oldPointComponent = this.#pointComponent;
    this.#pointComponent = this.#createPointComponent();
    replace(this.#pointComponent, oldPointComponent);
    this.#editFormComponent = this.#createEditFormComponent();
  }

  destroy() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }
}
