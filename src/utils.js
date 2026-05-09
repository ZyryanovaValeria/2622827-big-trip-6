import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const padZero = (value) => String(value).padStart(2, '0');

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomArrayElement = (items) => items[getRandomInteger(0, items.length - 1)];

const humanizePointDate = (date) =>
  dayjs(date).format('MMM DD').toUpperCase();

const humanizePointTime = (date) =>
  dayjs(date).format('HH:mm');

const humanizeEditFormDateTime = (date) =>
  dayjs(date).format('DD/MM/YY HH:mm');

const getDuration = (dateFrom, dateTo) => {
  const pointDuration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const days = Math.floor(pointDuration.asDays());
  const hours = pointDuration.hours();
  const minutes = pointDuration.minutes();

  if (days > 0) {
    return `${padZero(days)}D ${padZero(hours)}H ${padZero(minutes)}M`;
  }

  if (hours > 0) {
    return `${padZero(hours)}H ${padZero(minutes)}M`;
  }

  return `${padZero(minutes)}M`;
};

export {
  getRandomInteger,
  getRandomArrayElement,
  humanizePointDate,
  humanizePointTime,
  humanizeEditFormDateTime,
  getDuration,
};
