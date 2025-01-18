import dayjs from 'dayjs';
import { createElement } from '../render.js';
// точка маршрута в виде строки
function createEditPointTemplate() {
  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">MAR 18</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
        </div>
        <h3 class="event__title">Taxi Amsterdam</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
          </p>
          <p class="event__duration">30M</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">20</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">20</span>
          </li>
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


class EditPointView {
  element = null;

  constructor(point, currentOffers) {
    this.element = createElement(createEditPointTemplate());
    const imgPoint = this.element.querySelector('.event__type-icon');
    imgPoint.src = `img/icons/${point.type.toLowerCase()}.png`;

    // 'MAR 18'
    const eventDate = this.element.querySelector('.event__date');
    const dateFrom = dayjs(point.dateFrom).format('MMM D').toUpperCase();
    eventDate.textContent = `${dateFrom}`;

    //'01:45 - 02:45'
    const startTime = this.element.querySelector('.event__start-time');
    const startEnd = this.element.querySelector('.event__end-time');
    const timeFrom = dayjs(point.dateFrom).format('HH:mm');
    const timeTo = dayjs(point.dateTo).format('HH:mm');
    startTime.textContent = timeFrom;
    startEnd.textContent = timeTo;

    // разница во времени '02D 01H 35M'
    const time1 = dayjs(point.dateFrom);
    const time2 = dayjs(point.dateTo);

    // Вычисляем разницу в миллисекундах
    const diffInMilliseconds = time2.diff(time1);

    // Вычисляем количество дней
    const days = Math.floor(diffInMilliseconds / (24 * 60 * 60 * 1000));

    // Вычисляем разницу в оставшихся миллисекундах
    const remainingMilliseconds = diffInMilliseconds % (24 * 60 * 60 * 1000);

    // Вычисляем количество часов и минут
    const hours = Math.floor(remainingMilliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMilliseconds % (60 * 60 * 1000)) / (60 * 1000));

    // Форматируем результат
    const formattedDifference = `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
    const eventDuration = this.element.querySelector('.event__duration');
    eventDuration.textContent = formattedDifference;

    //цена
    const pElement = this.element.querySelector('.event__price');
    pElement.textContent = `€ ${point.basePrice}`;

    //офферы
    const offersContainer = this.element.querySelector('.event__selected-offers');
    offersContainer.innerHTML = '';
    currentOffers.offers.map((item) => {
      const liElement = document.createElement('li');
      liElement.classList.add('event__offer');
      const spanElement1 = document.createElement('span');
      spanElement1.classList.add('event__offer-title');
      spanElement1.textContent = item.title;
      const spanElement2 = document.createElement('span');
      spanElement2.classList.add('event__offer-price');
      spanElement2.textContent = `+€ ${item.price}`;

      liElement.appendChild(spanElement1);
      liElement.appendChild(spanElement2);
      offersContainer.appendChild(liElement);

    });
  }

  getElement() {
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

export { EditPointView };
