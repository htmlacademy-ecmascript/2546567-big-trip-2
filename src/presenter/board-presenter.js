
import { render, RenderPosition } from '../render.js';
import { EditFormView } from '../view/edit-form-view.js';
import { EditPointView } from '../view/edit-point-view.js';
import { FilterView } from '../view/filter-view.js';
import { SortView } from '../view/sort-view.js';

class BoardPresenter {
  //фильтры
  filterComponent = null;
  filterComponentContainer = null;

  //сортировка
  tripEventsContainer = null;
  sortComponent = null;

  // форма редактирования
  editFormContainer = null;
  editFormComponent = null;

  // точки маршрута
  editPointComponentContainer = null;
  editPoins = [];

  constructor(points, offersData, destinations) {
    this.tripEventsContainer = document.querySelector('.trip-events');
    this.filterComponentContainer = document.querySelector('.trip-controls__filters');
    this.editFormComponentContainer = document.querySelector('.trip-events__item');
    this.editPointComponentContainer = document.querySelector('.trip-events__list');

    this.filterComponent = new FilterView();
    this.sortComponent = new SortView();
    this.editFormComponent = new EditFormView(destinations,offersData);

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      //ищем оферы, которые подходят по типу для поинта
      const currentOffers = offersData.find((item) => item.type === point.type);
      const pointComponent = new EditPointView(point, currentOffers);
      this.editPoins.push(pointComponent);
    }
  }

  init() {
    render(this.filterComponent, this.filterComponentContainer);
    render(this.sortComponent, this.tripEventsContainer, RenderPosition.AFTERBEGIN);
    render(this.editFormComponent, this.editPointComponentContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.editPoins.length; i++) {
      render(this.editPoins[i], this.editPointComponentContainer, RenderPosition.BEFOREEND);
    }
  }
}

export { BoardPresenter };
