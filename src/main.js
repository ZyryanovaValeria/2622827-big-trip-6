import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsSection,
  pointsModel,
  filterModel,
  newPointButton,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  pointsModel,
  filterModel,
});

filterPresenter.init();

boardPresenter.init();

