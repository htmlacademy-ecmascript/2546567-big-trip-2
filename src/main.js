import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/FilterModel.js';
import PointsApiService from './points-api-service.js';
import PointsModel from './model/PointsModel.js';
import { BoardPresenter } from './presenter/board-presenter.js';
import NewPointButtonView from './view/new_point_button_view.js';
import { render } from './framework/render.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://21.objects.pages.academy/point-manager';

const tripMainContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel({
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
