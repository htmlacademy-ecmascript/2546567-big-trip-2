import AbstractView from '../framework/view/abstract-view';

const createTotalCostTemplete = (cost) => (
  `<p class="trip-info__cost">
  Total:&euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`);

export default class TotalCost extends AbstractView {
  #const = null;

  constructor(cost) {
    super();
    this.#const = cost;
  }

  get template() {
    return createTotalCostTemplete(this.#const);
  }
}
