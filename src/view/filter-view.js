
import AbstractView from '../framework/view/abstract-view';

function createFilterItemsTemplate(item, currentFilterType) {
  const isChecked = item.type === currentFilterType;

  return `
      <div class="trip-filters__filter">
        <input id="filter-${item.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item.type}" ${isChecked ? 'checked' : ''} ${item.count === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${item.type}">${item.type}</label>
      </div>
`;
}


function createFilterTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems.map((item) => createFilterItemsTemplate(item, currentFilterType)).join('');

  return `
      <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.querySelectorAll('.trip-filters__filter-input').forEach((item) => {
      item.addEventListener('click', this.#filterTypeChangeHandler);
    });

  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

}

