import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = [];

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }
}
