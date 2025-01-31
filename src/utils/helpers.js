import dayjs from 'dayjs';
import { FilterType } from '../const';

const now = dayjs();

const filter = {
  [FilterType.EVERYTHING] : (points) => points.filter((point) => point),
  [FilterType.PRESENT] : (points) => points.filter((point) => point.dateFrom < now && point.dateTo > now),
  [FilterType.PAST] : (points) => points.filter((point) => point.dateFrom < now && point.dateTo < now),
  [FilterType.FUTURE] : (points) => points.filter((point) => point.dateFrom > now && point.dateTo > now),
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
  return pointA.basePrice - pointB.basePrice;
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
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationA - durationB;
}

function sortPointByOffersUp(pointA, pointB) {
  return pointA.offers.length - pointB.offers.length;
}


export {filter, humanizePointDueDate, sortPointByDayUp, sortPointByPriceUp, sortPointByEventUp, sortPointByTimeDiffUp, sortPointByOffersUp};
