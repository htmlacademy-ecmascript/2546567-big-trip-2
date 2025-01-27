import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

// Генерация шаблона точки маршрута
function createEditPointTemplate(point, currentOffers) {


  const eventDate = dayjs(point.dateFrom).format('MMM D').toUpperCase();
  const timeFrom = dayjs(point.dateFrom).format('HH:mm');
  const timeTo = dayjs(point.dateTo).format('HH:mm');

  const time1 = dayjs(point.dateFrom);
  const time2 = dayjs(point.dateTo);
  const diffInMilliseconds = time2.diff(time1);
  const days = Math.floor(diffInMilliseconds / (24 * 60 * 60 * 1000));
  const remainingMilliseconds = diffInMilliseconds % (24 * 60 * 60 * 1000);
  const hours = Math.floor(remainingMilliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMilliseconds % (60 * 60 * 1000)) / (60 * 1000));
  const formattedDifference = `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(point.dateFrom).format()}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${point.destination.name || ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dayjs(point.dateFrom).format()}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dayjs(point.dateTo).format()}">${timeTo}</time>
          </p>
          <p class="event__duration">${formattedDifference}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${currentOffers.offers.map((item) => `
            <li class="event__offer">
              <span class="event__offer-title">${item.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${item.price}</span>
            </li>
          `).join('')}
        </ul>
        <button class="event__favorite-btn event__favorite-btn--active" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class EditPointView extends AbstractView {
  #point = null;
  #offers = null;
  #handleEditClick = null;

  constructor(point, currentOffers, onEditClick) {
    super();
    this.#point = point;
    this.#offers = currentOffers;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEditPointTemplate(this.#point, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
