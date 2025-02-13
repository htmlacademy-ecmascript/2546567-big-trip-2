import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];

  constructor({destinationsApiService}) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
    // this._notify(UpdateType.MAJOR, this.#destinations);
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
      console.log('Пришли ВСЕ destinations', this.#destinations);
      // this._notify(UpdateType.INIT);
      return this.#destinations;
    } catch(err) {
      console.log('Ошибка:', err);
      this.#destinations = [];
      this._notify(UpdateType.ERROR);
    }
  }


}
