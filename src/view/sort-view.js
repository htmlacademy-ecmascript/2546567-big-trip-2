
import { SortType } from '../const';
import AbstractView from '../framework/view/abstract-view';

function getSortTypeLabelText(sortType) {
  switch (sortType) {
    case SortType.DAY:
      return 'Day';
    case SortType.EVENT:
      return 'Event';
    case SortType.TIME:
      return 'Time';
    case SortType.PRICE:
      return 'Price';
    case SortType.OFFER:
      return 'Offers';
    default:
      return 'Day';
  }
}

function createSortItemTemplate(item, currentSortType) {
  const isActive = item === currentSortType;

  return `
    <div class="trip-sort__item  trip-sort__item--${item}" >
      <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}" data-sort-type="${item}" ${isActive ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${item}">${getSortTypeLabelText(item)}</label>
    </div>
`;
}


function createSortTemplate(currentSortType) {
  const sortItemsTemplate = Object.values(SortType).map((item) => createSortItemTemplate(item, currentSortType)).join('');

  return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sortItemsTemplate}
      </form>
`;
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    const inputElement = evt.target.closest('input'); // Найдем ближайший input

    if (!inputElement) {
      return; // Если событие не на input, выходим
    }

    evt.preventDefault();
    this.#handleSortTypeChange(inputElement.dataset.sortType); // Получаем dataset.sortType
  };
}


