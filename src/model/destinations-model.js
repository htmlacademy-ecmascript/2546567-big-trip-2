import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }
}
