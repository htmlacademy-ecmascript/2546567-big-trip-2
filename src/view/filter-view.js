
import AbstractView from '../framework/view/abstract-view';

function createFilterItemsTemplate(filter) {

  return `
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked ${filter.count === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">${filter.type}</label>
      </div>
`;
}


function createFilterViewTemplate(filterItems) {
  const filterItemsTemplate = filterItems.map((item) => createFilterItemsTemplate(item)).join('');

  return `
      <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
`;
}


export default class FilterView extends AbstractView {
  #element = null;

  constructor (filterItems) {
    super();
    this.#element = filterItems;
  }

  get template() {
    return createFilterViewTemplate(this.#element);
  }

}

