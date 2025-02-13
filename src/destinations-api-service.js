import ApiService from './framework/api-service.js';

export default class DestinationsApiService extends ApiService {
  get destinations() {
    console.log('ПОПЫТКА...');
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }
}
