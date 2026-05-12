import {FILTER_TYPES} from '../const.js';

const isFuturePoint = (point, now) => point.dateFrom > now;
const isPastPoint = (point, now) => point.dateTo < now;
const isPresentPoint = (point, now) =>
  point.dateFrom <= now && point.dateTo >= now;

const filter = {
  [FILTER_TYPES.EVERYTHING]: (points) => points,
  [FILTER_TYPES.FUTURE]: (points) => {
    const now = new Date();
    return points.filter((point) => isFuturePoint(point, now));
  },
  [FILTER_TYPES.PRESENT]: (points) => {
    const now = new Date();
    return points.filter((point) => isPresentPoint(point, now));
  },
  [FILTER_TYPES.PAST]: (points) => {
    const now = new Date();
    return points.filter((point) => isPastPoint(point, now));
  },
};

const generateFilters = (points, currentFilter) => {
  const now = new Date();

  return [
    {
      type: FILTER_TYPES.EVERYTHING,
      name: 'Everything',
      isChecked: currentFilter === FILTER_TYPES.EVERYTHING,
      isDisabled: false,
    },
    {
      type: FILTER_TYPES.FUTURE,
      name: 'Future',
      isChecked: currentFilter === FILTER_TYPES.FUTURE,
      isDisabled: !points.some((point) => isFuturePoint(point, now)),
    },
    {
      type: FILTER_TYPES.PRESENT,
      name: 'Present',
      isChecked: currentFilter === FILTER_TYPES.PRESENT,
      isDisabled: !points.some((point) => isPresentPoint(point, now)),
    },
    {
      type: FILTER_TYPES.PAST,
      name: 'Past',
      isChecked: currentFilter === FILTER_TYPES.PAST,
      isDisabled: !points.some((point) => isPastPoint(point, now)),
    },
  ];
};

export {filter, generateFilters};
