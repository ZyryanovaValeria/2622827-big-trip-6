import ApiService from '../framework/api-service.js';
import {adaptToServer} from './adapters/point-adapter.js';

export default class TripApi extends ApiService {
  getPoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  createPoint(point) {
    const serverPoint = adaptToServer(point);
    delete serverPoint.id;

    return this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(serverPoint),
      headers: new Headers({'Content-Type': 'application/json'}),
    }).then(ApiService.parseResponse);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    }).then(ApiService.parseResponse);
  }

  deletePoint(pointId) {
    return this._load({
      url: `points/${pointId}`,
      method: 'DELETE',
    });
  }
}
