import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { offersModel } from '../main.js';

function getFormattedDifferenceTime(pointDateFrom, pointDateTo) {
  const time1 = dayjs(pointDateFrom);
  const time2 = dayjs(pointDateTo);
  const diffInMilliseconds = time2.diff(time1);
  const days = Math.floor(diffInMilliseconds / (24 * 60 * 60 * 1000));
  const remainingMilliseconds = diffInMilliseconds % (24 * 60 * 60 * 1000);
  const hours = Math.floor(remainingMilliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMilliseconds % (60 * 60 * 1000)) / (60 * 1000));
  return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
}

function createPointTemplate(point) {
  const eventDate = dayjs(point.dateFrom).format('MMM D').toUpperCase();
  const timeFrom = dayjs(point.dateFrom).format('HH:mm');
  const timeTo = dayjs(point.dateTo).format('HH:mm');
  const formattedDifference = getFormattedDifferenceTime(point.dateFrom, point.dateTo);

  const allOffers = offersModel.offers;
  const offers = allOffers.find((item) => item.type === point.type).offers;

  const currentOffers = point.offers.map((id) => {
    const offerObj = offers.find((offer) => offer.id === id);
    return offerObj;
  });

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(point.dateFrom).format()}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type.toLowerCase()} ${point.destination.name || ''}</h3>
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
          ${currentOffers.map((item) => `
            <li class="event__offer">
              <span class="event__offer-title">${item?.title || ''}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${item?.price || ''}</span>
            </li>
          `).join('')}
        </ul>
        <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
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

export default class PointView extends AbstractView {
  #point = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
