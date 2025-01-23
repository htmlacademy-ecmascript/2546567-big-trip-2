import { render, RenderPosition, replace } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import EditPointView from '../view/edit-point-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';

class BoardPresenter {
  //фильтры
  filterComponent = null;
  filterComponentContainer = null;

  //сортировка
  tripEventsContainer = null;
  sortComponent = null;

  // форма редактирования
  editFormContainer = null;
  // editFormComponent = null;

  // точки маршрута
  editPointComponentContainer = null;
  // editPoints = [];

  points = [];
  offersData = [];
  destinations = [];

  currentPointInstance;
  currentFormInstance;

  constructor(points, offersData, destinations) {
    this.points = points;
    this.offersData = offersData;
    this.destinations = destinations;

    this.tripEventsContainer = document.querySelector('.trip-events');
    this.filterComponentContainer = document.querySelector('.trip-controls__filters');
    this.editFormComponentContainer = document.querySelector('.trip-events__item');
    this.editPointComponentContainer = document.querySelector('.trip-events__list');

    this.filterComponent = new FilterView();
    this.sortComponent = new SortView();

  }

  init() {
    render(this.filterComponent, this.filterComponentContainer);
    render(this.sortComponent, this.tripEventsContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i]);
    }
  }

  #renderPoint(point) {

    const currentOffers = this.offersData.find((item) => item.type === point.type);


    const pointEditComponent = new EditPointView(point, currentOffers, () => {
      replacePointToForm();
    });

    const formComponent = new EditFormView(this.destinations, this.offersData, () => {
      replaceFormToPoint();
    });

    function replacePointToForm() {
      replace(formComponent, pointEditComponent);
      //
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function replaceFormToPoint() {
      replace(pointEditComponent,formComponent);
      //
      document.addEventListener('keydown', escKeyDownHandler);
    }
    //
    function escKeyDownHandler(evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    }
    render(pointEditComponent, this.editPointComponentContainer);
  }
}

export { BoardPresenter };
