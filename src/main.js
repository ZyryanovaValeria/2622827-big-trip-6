import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import TripApi from './api/trip-api.js';
import LoadingView from './view/loading-view.js';
import FailedLoadView from './view/failed-load-view.js';
import UiBlocker from './framework/ui-blocker/ui-blocker.js';
import {render, remove} from './framework/render.js';
import {API_URL} from './const.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const authorization = `Basic ${Math.random().toString(36).slice(2, 14)}`;
const tripApi = new TripApi(API_URL, authorization);
const pointsModel = new PointsModel({api: tripApi});
const filterModel = new FilterModel();
const uiBlocker = new UiBlocker({lowerLimit: 350, upperLimit: 500});

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsSection,
  pointsModel,
  filterModel,
  newPointButton,
  uiBlocker,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  pointsModel,
  filterModel,
});

const loadingComponent = new LoadingView();
render(loadingComponent, tripEventsSection);

const bootstrap = async () => {
  try {
    await pointsModel.init();
    remove(loadingComponent);
    filterPresenter.init();
    boardPresenter.init();
    newPointButton.disabled = false;
  } catch {
    remove(loadingComponent);
    render(new FailedLoadView(), tripEventsSection);
    filterPresenter.init();
  }
};

bootstrap();
