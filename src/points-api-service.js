import ApiService from './framework/api-service.js';
// import { points } from './mocks/points-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      // 'due_date': point.dueDate instanceof Date ? point.dueDate.toISOString() : null,
      'is_favorite': point.isFavorite,
      'base_price': parseInt(point.basePrice, 10),
      'date_from' :point.dateFrom,
      'date_to' :point.dateTo,
    };

    delete adaptedPoint.isFavorite;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.dataFrom;
    delete adaptedPoint.dataTo;
    return adaptedPoint;
  }
}
