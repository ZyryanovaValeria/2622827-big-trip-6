import {generatePoint, destinations, offersByType} from '../mock/point.js';
import {generateFilters} from '../mock/filter.js';
import Observable from '../framework/observable.js';

const POINT_COUNT = 5;

export default class PointsModel extends Observable {
  #newPointId = POINT_COUNT + 1;

  constructor() {
    super();
    this.points = this.#ensurePresentPoint(Array.from({length: POINT_COUNT}, generatePoint));
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  getPoints() {
    return this.points.slice();
  }

  setPoints(points) {
    this.points = points.slice();
    this._notify('pointsListChange', this.getPoints());
  }

  updatePoint(pointId, updatedPoint) {
    const index = this.points.findIndex((point) => point.id === pointId);

    if (index === -1) {
      return null;
    }

    const updatedPoints = this.getPoints();
    updatedPoints[index] = updatedPoint;
    this.setPoints(updatedPoints);

    return updatedPoint;
  }

  addPoint(newPoint) {
    const pointToAdd = {
      ...newPoint,
      id: this.#newPointId,
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

  #ensurePresentPoint(points) {
    const now = new Date();
    const hasPresentPoint = points.some((point) => point.dateFrom <= now && point.dateTo >= now);

    if (hasPresentPoint || points.length === 0) {
      return points;
    }

    const presentPointStart = new Date(now.getTime() - 60 * 60 * 1000);
    const presentPointEnd = new Date(now.getTime() + 60 * 60 * 1000);

    const [firstPoint, ...otherPoints] = points;

    return [
      {
        ...firstPoint,
        dateFrom: presentPointStart,
        dateTo: presentPointEnd,
      },
      ...otherPoints,
    ];
  }
}

