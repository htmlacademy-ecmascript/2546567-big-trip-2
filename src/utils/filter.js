import dayjs from 'dayjs';
import { FilterType } from './constants';

const now = dayjs();


const filter = {
  [FilterType.EVERYTHING] : (points) => points.filter((point) => point),
  [FilterType.PRESENT] : (points) => points.filter((point) => point.dateFrom < now && point.dateTo > now),

  [FilterType.PAST] : (points) => points.filter((point) => point.dateFrom < now && point.dateTo < now),

  [FilterType.FUTURE] : (points) => points.filter((point) => point.dateFrom > now && point.dateTo > now),


};


function generateFilterMocks(points) {
  return Object.entries(filter).map (
    ([filterType,filterPoint]) => ({
      type : filterType,
      count : filterPoint(points).length,
    }),
  );
}

export {filter, generateFilterMocks};
