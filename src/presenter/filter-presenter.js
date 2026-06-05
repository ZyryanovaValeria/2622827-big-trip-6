import FilterView from '../view/filter-view.js';
import {render, replace} from '../framework/render.js';
import {generateFilters} from '../utils/filter.js';

export default class FilterPresenter {
  #filterContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #filterComponent = null;

  constructor({filterContainer, pointsModel, filterModel}) {
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderFilter();
  }

  #renderFilter() {
    const filterType = this.#filterModel.getFilter();
    const filters = generateFilters(this.#pointsModel.getPoints(), filterType);

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };

  #handleModelEvent = () => {
    this.#renderFilter();
  };
}
