import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';
// import { offersData } from '../mocks/offer-model.js';
// import { destinationsData } from '../mocks/destinations-model.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #destinations = [];
  #offers = [];
  #points = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
    this._notify(UpdateType.MAJOR, this.#points);
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      console.log('Пришли points', this.#points);


      this.#destinations = await this.#pointsApiService.destinations;
      console.log('Пришли destinations', this.#destinations);
      if(this.#destinations.length) {
        const updatedPoints = this.#points.map((point) => {
          const currentDestination = this.#destinations.find((destination) => destination.id === point.destination);
          const updatePoint = {...point, destination: currentDestination};
          return updatePoint;
        });
        console.log('Улучшенные поинты', updatedPoints);
        this.#points = updatedPoints;
      }

      this.#offers = await this.#pointsApiService.offers;
      console.log('Пришли offers', this.#offers);
      //Тут разложить оферы в поинты
      if(this.#offers.length) { }


      this._notify(UpdateType.INIT);
    } catch(err) {
      console.log('Ошибка:', err);

      this.#points = [];
      this.#destinations = [];
      this.#offers = [];

      this._notify(UpdateType.ERROR);
    }

  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      // const response = await this.#pointsApiService.updatePoint(update);
      // const updatedPoint = this.#adaptToClient(response);
      //  пока без сервера...
      const updatedPoint = update;

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      // const response = await this.#pointsApiService.addPoint(update);
      const response = {...update};
      const newPoint = this.#adaptToClient(response);

      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    // const currentOffers = this.#offers.find((item) => item.type === point.type).offers;
    // const currentDestination = destinationsData.find((item) => item.name === point.destination.name);

    const adaptedPoint = {...point,
      // offers: currentOffers,
      // destination: currentDestination,
      isFavorite: point['is_favorite'],
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
    };

    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    return {...adaptedPoint};
  }
}
