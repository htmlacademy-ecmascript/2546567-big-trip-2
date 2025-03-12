import dayjs from 'dayjs';
import { FilterType } from '../const';

export const isEscapeKey = (evt) => evt.key === 'Escape';

const filter = {
  [FilterType.EVERYTHING] : (points) => points.filter((point) => point),
  [FilterType.PRESENT]: (points) => points.filter((point) =>
    (dayjs(point.dateFrom).isBefore(dayjs(), 'day') || dayjs(point.dateFrom).isSame(dayjs(), 'day')) &&
    (dayjs(point.dateTo).isAfter(dayjs(), 'day') || dayjs(point.dateTo).isSame(dayjs(), 'day'))
  ),
  [FilterType.PAST] : (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs(), 'day')),
  [FilterType.FUTURE] : (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs(), 'day')),
};

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortPointByDayUp(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);
  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortPointByPriceUp(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointByTimeDiffUp(pointA, pointB) {
  if (!pointA.dateTo || !pointA.dateFrom || !pointB.dateTo || !pointB.dateFrom) {
    return 0;
  }

  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

export {filter, sortPointByDayUp, sortPointByPriceUp, sortPointByTimeDiffUp};
