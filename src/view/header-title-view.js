import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

function renderDestinations({ firstDestination, secondDestination, lastDestination, destinationsCount }) {
  let route = '';

  switch (destinationsCount) {
    case 1:
      route = `${firstDestination}`;
      break;
    case 2:
      route = `${firstDestination} &mdash; ${lastDestination}`;
      break;
    case 3:
      route = `${firstDestination} &mdash; ${secondDestination} &mdash; ${lastDestination}`;
      break;
    default:
      route = `${firstDestination} &mdash; ... &mdash; ${lastDestination}`;
      break;
  }

  return route;
}

const renderDates = (dates) => {
  if(dates) {
    const { firstDate, secondDate } = dates;
    const startDate = dayjs(firstDate);
    const endDate = dayjs(secondDate);

    const startDay = startDate.format('D');
    const startMonth = startDate.format('MMM');
    const endDay = endDate.format('D');
    const endMonth = endDate.format('MMM');

    return `${startDay} ${startMonth} — ${endDay} ${endMonth}`;
  }
};

const createTripTitleTemplate = (destinations, dates) => (
  `<div class="trip-info__main">
  <h1 class="trip-info__title">${renderDestinations(destinations)}</h1>

 <p class="trip-info__dates">${renderDates(dates)}</p>
 </div>`);

export default class TripTitleView extends AbstractView {
  #destinations = null;
  #dates = null;

  constructor(destinations, dates) {
    super();
    this.#destinations = destinations;
    this.#dates = dates;
  }

  get template() {
    return createTripTitleTemplate(this.#destinations, this.#dates);

  }
}
