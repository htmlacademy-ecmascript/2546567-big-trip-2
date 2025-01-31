
import AbstractView from '../framework/view/abstract-view';

function createFilterItemsTemplate(item) {
  return `
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked ${item.count === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">${item.type}</label>
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

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

}

