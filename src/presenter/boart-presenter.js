
import { render, RenderPosition } from '../render.js';
import { EditFormView } from '../view/edit-form-view.js';
import { EditPointView } from '../view/edit-point-view.js';
import { FilterView } from '../view/filter-view.js';
import { SortView } from '../view/sort-view.js';

class BoardPresenter {
  //фильтры
  filterComponent = new FilterView();
  filterComponentContainer = null;

  //сортировка
  tripEventsContainer = null;
  sortComponent = new SortView();
  // форма редактирования
  editFormContainer = null;
  editFormComponent = new EditFormView();
  constructor() {
    this.tripEventsContainer = document.querySelector('.trip-events');
    this.filterComponentContainer = document.querySelector('.trip-controls__filters');
    this.editFormComponentContainer = document.querySelector('.trip-events__item');
  }

  init() {
    const ulElement = document.createElement('ul');
    ulElement.classList.add('trip-events__list');
    this.tripEventsContainer.insertAdjacentElement(RenderPosition.BEFOREEND, ulElement);
    const editPointComponentContainer = document.querySelector('.trip-events__list');

    render(this.filterComponent, this.filterComponentContainer, RenderPosition.BEFOREEND);
    render(this.sortComponent, this.tripEventsContainer, RenderPosition.AFTERBEGIN);
    render(this.editFormComponent, editPointComponentContainer, RenderPosition.AFTERBEGIN);

    for (let index = 0; index < 3; index++) {
      // точка маршрута
      const editPointComponent = new EditPointView();
      render(editPointComponent, editPointComponentContainer, RenderPosition.BEFOREEND);
    }
  }
}

export { BoardPresenter };
