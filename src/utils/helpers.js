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

function sortPointUp(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dueDate, pointB.dueDate);

  return weight ?? dayjs(pointA.dueDate).diff(dayjs(pointB.dueDate));
}

function sortPointDown(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dueDate, pointB.dueDate);

  return weight ?? dayjs(pointB.dueDate).diff(dayjs(pointA.dueDate));
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export {filter, humanizePointDueDate, sortPointUp, sortPointDown, isDatesEqual};
