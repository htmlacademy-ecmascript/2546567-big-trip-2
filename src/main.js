import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/FilterModel.js';
import PointsApiService from './points-api-service.js';
import PointsModel from './model/PointsModel.js';
import { BoardPresenter } from './presenter/board-presenter.js';
import NewPointButtonView from './view/new_point_button_view.js';
import { render } from './framework/render.js';
import DestinationsModel from './model/DestinationsModel.js';
import OffersModel from './model/OffersModel.js';

const AUTHORIZATION = 'Basic hS5syS74pcl1la7j';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const tripMainContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

export const destinationsModel = new DestinationsModel();
export const offersModel = new OffersModel();

export const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsContainer,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
boardPresenter.init();


pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, tripMainContainer);
  });
