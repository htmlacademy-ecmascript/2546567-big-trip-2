import dayjs from 'dayjs';
import { FilterType } from '../const';

const filter = {
  [FilterType.EVERYTHING] : (points) => points.filter((point) => point),
  [FilterType.PRESENT] : (points) => points.filter((point) => dayjs(point.dateFrom).isBefore(dayjs(), 'day') && dayjs(point.dateTo).isAfter(dayjs(), 'day')),
  [FilterType.PAST] : (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs(), 'day')),
  [FilterType.FUTURE] : (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs(), 'day')),
};

const DATE_FORMAT = 'D MMMM';

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
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

function sortPointByEventUp(pointA, pointB) {
  if (pointA.destination.name.toLowerCase() < pointB.destination.name.toLowerCase()) {
    return -1;
  }
  if (pointA.destination.name.toLowerCase() > pointB.destination.name.toLowerCase()) {
    return 1;
  }
  return 0;
}

function sortPointByTimeDiffUp(pointA, pointB) {
  if (!pointA.dateTo || !pointA.dateFrom || !pointB.dateTo || !pointB.dateFrom) {
    return 0; // Если даты отсутствуют, считаем точки равными
  }

  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA; // От самой долгой до самой короткой
}

function sortPointByOffersUp(pointA, pointB) {
  return pointB.offers.length - pointA.offers.length;
}


export {filter, humanizePointDueDate, sortPointByDayUp, sortPointByPriceUp, sortPointByEventUp, sortPointByTimeDiffUp, sortPointByOffersUp};
