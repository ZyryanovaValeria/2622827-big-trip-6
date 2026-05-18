import {adaptToApp} from '../api/adapters/point-adapter.js';
import {generateFilters} from '../utils/filter.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #api = null;
  #newPointId = 1;

  constructor({api}) {
    super();
    this.#api = api;
    this.points = [];
    this.destinations = [];
    this.offersByType = [];
  }

  async init() {
    try {
      const points = await this.#api.getPoints();
      this.points = points.map(adaptToApp);
    } catch {
      this.points = [];
      throw new Error('Failed to load points');
    }

    try {
      this.destinations = await this.#api.getDestinations();
    } catch {
      this.destinations = [];
    }

    try {
      this.offersByType = await this.#api.getOffers();
    } catch {
      this.offersByType = [];
    }
  }

  getPoints() {
    return this.points.slice();
  }

  setPoints(points) {
    this.points = points.slice();
    this._notify('pointsListChange', this.getPoints());
  }

  async updatePoint(pointId, updatedPoint) {
    const index = this.points.findIndex((point) => point.id === pointId);

    if (index === -1) {
      return null;
    }

    const serverPoint = await this.#api.updatePoint(updatedPoint);
    const appPoint = adaptToApp(serverPoint);

    const updatedPoints = this.getPoints();
    updatedPoints[index] = appPoint;
    this.setPoints(updatedPoints);

    return appPoint;
  }

  addPoint(newPoint) {
    const pointToAdd = {
      ...newPoint,
      id: String(this.#newPointId),
    };

    this.#newPointId += 1;
    this.setPoints([pointToAdd, ...this.getPoints()]);

    return pointToAdd;
  }

  deletePoint(pointId) {
    const points = this.getPoints();
    const index = points.findIndex((point) => point.id === pointId);

    if (index === -1) {
      return null;
    }

    const [deletedPoint] = points.splice(index, 1);
    this.setPoints(points);

    return deletedPoint;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType() {
    return this.offersByType;
  }

  getFilters() {
    return generateFilters(this.getPoints());
  }
}
