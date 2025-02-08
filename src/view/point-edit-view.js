import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import 'flatpickr/dist/flatpickr.min.css';
import { destinationsData } from '../mocks/destinations-model.js';
import { offersData } from '../mocks/offer-model.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Mode } from '../presenter/point-presenter.js';

const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const BLANK_POINT = {
  id: '99999999999999999999999',
  'base_price': 1600,
  dateFrom: '2024-12-10T10:55:56.845Z',
  dateTo: '2024-12-16T12:22:15.375Z',
  destination: {
    name: 'Amsterdam',
  },
  'is_favorite': false,
  offers: [
    {
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
      title: 'Upgrade to a economy class',
      price: 100,
    },
    {
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa32',
      title: 'Upgrade to a comfort class',
      price: 150,
    },
    {
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa33',
      title: 'Upgrade to a vip class',
      price: 200,
    },
  ],
  type: 'Bus',
};

function createEditPointTemplate(point, mode) {

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${EVENT_TYPES.map(
    (type) => `
                <div class="event__type-item">
                  <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}">
                  <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">${
  type.charAt(0).toUpperCase() + type.slice(1)
}</label>
                </div>
              `
  )
    .join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">${
  point.type
}</label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
  point.destination.name
}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsData
    .map(
      (destination) => `<option value="${destination.name}"></option>`
    )
    .join('')}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1"><span class="visually-hidden">Price</span>&euro;</label>
          <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${mode === Mode.DEFAULT ? 'Cancel' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        <section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${point.offers
    .map(
      (offer) => `
              <div class="event__offer-selector">
                <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.title}">
                <label class="event__offer-label" for="event-offer-${offer.id}-1">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                </label>
              </div>
            `
    )
    .join('')}
          </div>
        </section>

        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${
  point.destination.description
}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${point.destination.pictures
    .map(
      (picture) => `
                <img class="event__photo" src="${picture.src}" alt="${picture.alt}">
              `
    )
    .join('')}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>
`;
}

export default class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #mode = null;

  constructor({ point = BLANK_POINT, onFormSubmit, onDeleteClick }) {
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

    if(point.id === '99999999999999999999999') {
      this.mode = Mode.DEFAULT;
    } else {
      this.mode = Mode.EDITING;
    }

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#mode);
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более не нужный календарь
  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
      offersData.offers
    );
  }

  _restoreHandlers() {
    this.element.querySelectorAll('.event__type-item').forEach((item) => {
      item.addEventListener('click', this.#eventTypeChangeHandler);
    });
    this.element
      .querySelector('.event__input')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.#setDatepicker();
  }

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const currentOffers = offersData.find(
      (element) =>
        element.type.toLowerCase() === evt.target.textContent.toLowerCase()
    );

    const newPoint = {
      ...this._state,
      type: currentOffers.type,
      offers: currentOffers.offers,
    };

    this.updateElement(newPoint);
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const currentDestination = destinationsData.find(
      (element) => element.name === evt.target.value
    );
    const newPoint = {
      ...this._state,
      destination: currentDestination,
    };
    this.updateElement(newPoint);
  };
  //=====================================================

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  // календарь-библиотека
  #dateFromCloseHandler = () => {
    this._setData({ point: { ...this._state.point.dateFrom } });
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };

  #dateToCloseHandler = () => {
    this._setData({ point: { ...this._state.point.dateTo } });
    this.#datepickerTo.set('maxDate', this._state.point.dateTo);
  };

  #setDatepicker() {
    const [dateFromElement, dataToElement] =
      this.element.querySelectorAll('.event__input--time');
    const commomConfig = {
      dateFormat: 'd/m/y H:1',
      enableTime: true,
      locale: { firstDayOfWeek: 1 },
      'time_24hr': true,
    };
    this.#datepickerFrom = flatpickr(dateFromElement, {
      ...commomConfig,
      defaultDate: this._state.dateFrom,
      onClose: this.dateFromCloseHandler,
      maxDate: this._state.dateTo,
    });
    this.#datepickerTo = flatpickr(dataToElement, {
      ...commomConfig,
      defaultDate: this._state.dateTo,
      onClose: this.dateFromCloseHandler,
      minDate: this._state.dateFrom,
    });
  }

  static parsePointToState(point) {
    return { ...point };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    // delete point.isDueDate;
    // delete point.isRepeating;
    // delete point.isDisabled;
    // delete point.isSaving;
    // delete point.isDeleting;

    return point;
  }
}
