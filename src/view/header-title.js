import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

function renderDestinations({ firstDestination, secondDestination, lastDestination, destinationsCount }) {
  let route = '';

  switch (destinationsCount) {
    case 1:
      route = `${firstDestination}`;
      break;
    case 2:
      route = `${firstDestination} - ${lastDestination}`;
      break;
    case 3:
      route = `${firstDestination} - ${secondDestination} - ${lastDestination}`;
      break;
    default:
      // Если городов больше трех, отображаем первый и последний город с многоточием
      route = `${firstDestination} - ... - ${lastDestination}`;
      break;
  }

  return route;
}

const renderDates = (dates) => {
  if(dates) {
    const { firstDate, secondDate } = dates;
    // Предполагаем, что firstDate и secondDate — это строки или объекты Date
    const startDate = dayjs(firstDate);
    const endDate = dayjs(secondDate);

    // Форматируем даты
    const startDay = startDate.format('D'); // День (например, 18)
    const endDay = endDate.format('D'); // День (например, 20)
    const month = endDate.format('MMM'); // Месяц в сокращенном формате (например, Mar)

    return `${startDay} — ${endDay} ${month}`;
  }
};

const createTripTitleTemplate = (destinations, dates) => (
  `<div class="trip-info__main">
  <h1 class="trip-info__title">${renderDestinations(destinations)}</h1>

 <p class="trip-info__dates">${renderDates(dates)}</p>
 </div>`);

export default class TripTitle extends AbstractView {
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
