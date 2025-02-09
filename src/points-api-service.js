import ApiService from './framework/api-service.js';
import { points } from './mocks/points-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  // Переопределяем метод _load
  async _load({
    url,
    method = 'GET',
    body = null,
    headers = new Headers(),
  }) {
    // Симуляция задержки 1 секунда
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Если URL соответствует 'points', возвращаем замоканные данные
    if (url === 'points') {
      return Promise.resolve({
        json: () => Promise.resolve(points), // Возвращаем замоканные данные
      });
    }

    // Для других URL можно выполнять реальный запрос (или эмуляцию других запросов)
    return super._load({ url, method, body, headers });
  }

  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
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
      // 'is_archived': point.isArchive,
      'is_favorite': point.isFavorite,
      'base_price':point.basePrice,
    };

    delete adaptedPoint.isFavorite;
    delete adaptedPoint.basePrice;
    return adaptedPoint;
  }
}
