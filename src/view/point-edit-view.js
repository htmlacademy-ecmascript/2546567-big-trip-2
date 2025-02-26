import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import { destinationsModel, offersModel } from '../main.js';

const DEFAULT_TYPE = 'flight';
// const DEFAULT_OFFERS = pointsModel.offers.find((item) => item.type === DEFAULT_TYPE);
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

function createEditPointTemplate(point, destinations) {
  const idEditing = !!point.id;

  const allOffers = offersModel.offers;
  const offers = allOffers.find((item) => item.type === point.type).offers;

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
                  <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)
}</label>
                </div>
              `
  ).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">${point.type
}</label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination"
          value="${point.destination ? point.destination.name : ''
}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations
    .map(
      (destination) => `<option value="${destination.name}"></option>`
    )
    .join('')}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${point.dateFrom ? dayjs(point.dateFrom).format() : ''
}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${point.dateTo ? dayjs(point.dateTo).format() : ''
}>
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1"><span class="visually-hidden">Price</span>&euro;</label>
          <input class="event__input event__input--price" id="event-price-1" type="number" name="event-price" value="${point.basePrice
}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${idEditing ? 'Delete' : 'Cancel'
}</button>
        ${idEditing
    ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`
    : ''
}
      </header>

      <section class="event__details">
        <section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offers
    .map((offer) => {
      const isChecked = point.offers.find((id) => id === offer.id);

      return `
              <div class="event__offer-selector">
                <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id
}" type="checkbox" name="event-offer-${offer.title}" ${isChecked ? 'checked' : ''
}>
                <label class="event__offer-label" for="event-offer-${offer.id}">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price
}</span>
                </label>
              </div>
            `;
    })
    .join('')}
          </div>
        </section>
          ${point.destination
    ? `
                  <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${point.destination.description
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
          `
    : ''
}

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
  #handleFormClose = null;
  #destinations = [];

  constructor({ point, onFormSubmit, onDeleteClick, onFormClose }) {
    super();
    if (point) {
      this._setState(PointEditView.parsePointToState(point));
    } else {
      const defaultPoint = {
        basePrice: 0,
        dateFrom: null,
        dateTo: null,
        destination: null,
        isFavorite: false,
        offers: [],
        type: DEFAULT_TYPE,
      };
      this._setState(PointEditView.parsePointToState(defaultPoint));
    }
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleFormClose = onFormClose;
    this.#destinations = destinationsModel.destinations;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations);
  }

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
    this.updateElement(PointEditView.parsePointToState(point));
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelectorAll('.event__type-item').forEach((item) => {
      item.addEventListener('click', this.#eventTypeChangeHandler);
    });
    this.element
      .querySelector('.event__input')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('#event-start-time-1')
      .addEventListener('change', this.#dateFromCloseHandler);
    this.element
      .querySelector('#event-end-time-1')
      .addEventListener('change', this.#dateToCloseHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element
      .querySelector('#event-price-1')
      .addEventListener('change', this.#formChangeBasePrice);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((item) => {
      item.addEventListener('click', this.#offerCheckClick);
    });

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('click', this.#formSubmitHandler);
    const rollupBtn = this.element.querySelector('.event__rollup-btn');

    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#handleFormClose);
    }

    this.#setDatepicker();
  }

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const newPoint = {
      ...this._state,
      type: evt.target.textContent.toLowerCase(),
    };
    this.updateElement(newPoint);
  };

  #formChangeBasePrice = (evt) => {
    evt.preventDefault();

    const newPoint = {
      ...this._state,
      basePrice: evt.target.value,
    };
    this.updateElement(newPoint);
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const currentDestination = this.#destinations.find(
      (element) => element.name === evt.target.value
    );

    const newPoint = {
      ...this._state,
      destination: currentDestination
        ? currentDestination
        : this.#destinations[0],
    };

    this.updateElement(newPoint);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const formattedPoint = PointEditView.parseStateToPoint(this._state);
    this.#handleFormSubmit(formattedPoint);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  // календарь-библиотека
  #dateFromCloseHandler = () => {
    const newDate = dayjs(this.#datepickerFrom.latestSelectedDateObj);
    this._setState({ dateFrom: newDate.toISOString() });
  };

  #dateToCloseHandler = () => {
    const newDate = dayjs(this.#datepickerTo.latestSelectedDateObj);
    this._setState({ dateTo: newDate.toISOString() });
  };

  #offerCheckClick = (evt) => {
    const str = evt.target.getAttribute('id');
    const uuid = str.replace('event-offer-', '');
    const isOfferExist = this._state.offers.find((item) => item === uuid);

    if (isOfferExist) {
      const newOffersIds = this._state.offers.filter((item) => item !== uuid);
      this._setState({ offers: newOffersIds });
    } else {
      const newOffersIds = [...this._state.offers, uuid];
      this._setState({ offers: newOffersIds });
    }
  };

  #setDatepicker() {
    const [dateFromElement, dataToElement] = this.element.querySelectorAll(
      '.event__input--time'
    );
    const commomConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: { firstDayOfWeek: 1 },
      'time_24hr': true
    };
    this.#datepickerFrom = flatpickr(dateFromElement, {
      ...commomConfig,
      defaultDate: this._state.dateFrom,
      onClose: this.dateFromCloseHandler,
    });
    this.#datepickerTo = flatpickr(dataToElement, {
      ...commomConfig,
      defaultDate: this._state.dateTo,
      onClose: this.dateFromCloseHandler,
    });
  }

  static parsePointToState(point) {
    return { ...point };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    return point;
  }
}
