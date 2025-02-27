import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';
import { filterModel } from '../main';

function getNoPointsText() {
  const filterType = filterModel.filter;
  switch (filterType) {
    case FilterType.EVERYTHING:
      return 'Click New Event to create your first point';

    default:
      return `There are no ${filterType.toLocaleLowerCase()} events now`;
  }
}

function createNoPointTemplate() {
  const text = getNoPointsText();
  return (`
 <p class="trip-events__msg">${text}</p>`
  );
}
export default class NoPointView extends AbstractView {
  constructor() {
    super();

    this.element.querySelector('.trip-events__msg');
  }

  get template() {
    return createNoPointTemplate();
  }
}
