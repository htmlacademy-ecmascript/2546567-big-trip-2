import TotalCost from '../view/total-cost.js';
import HeaderTitle from '../view/header-title.js';
import TripInfo from '../view/trip-info.js';

import { UpdateType } from '../const';
import { remove, render, RenderPosition, replace } from '../framework/render.js';

export default class HeaderPresenter {
  #heandlerConteiner = null;
  #pointsModel = null;
  #tripInfoComponent = null;
  #offers = null;

  constructor({ heandlerConteiner, pointsModel }) {
    this.#heandlerConteiner = heandlerConteiner;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderHeader();
  }

  #tripTitleData(points) {
    const destinations = points.map((point) => point.destination);
    const destinationsCount = new Set(destinations).size;
    const firstDestination = destinations[0];
    const lastDestination = destinations[destinations.length - 1];

    let secondDestination = null;
    if (destinationsCount === 3) {
      secondDestination = destinations[1];
    }

    return {
      firstDestination: firstDestination?.name || firstDestination,
      secondDestination: secondDestination?.name || secondDestination,
      lastDestination: lastDestination?.name || lastDestination,
      destinationsCount: destinationsCount
    };
  }

  #dateFieldData(points) {
    if(points.length) {
      return {
        firstDate: points[0].dateFrom,
        secondDate: points[points.length - 1].dateTo
      };
    }
  }

  #calculateTotalPrice(points) {
    return points.reduce((sum, point) => {
      sum += point.basePrice + this.#calculateOffersPrice(point.offers, point.type);
      return sum;
    }, 0);
  }

  #calculateOffersPrice(selectedOffers, type) {
    const offers = this.#offers.find((item) => item.type === type).offers;
    return offers.reduce((sum, item) => {
      if (selectedOffers.includes(item.id)) {
        sum += item.price;
      }
      return sum;
    }, 0);
  }

  #renderHeader() {
    this.#offers = this.#pointsModel.offers;

    const points = this.#pointsModel.points;

    if (points.length) {
      const destinations = this.#tripTitleData(points);
      const dates = this.#dateFieldData(points);

      const previousTripInfoComponent = this.#tripInfoComponent;

      const newTripInfoComponent = new TripInfo();
      if (previousTripInfoComponent === null) {
        render(newTripInfoComponent, this.#heandlerConteiner, RenderPosition.AFTERBEGIN);
      } else {
        replace(newTripInfoComponent, previousTripInfoComponent);
        remove(previousTripInfoComponent);
      }

      render(new HeaderTitle(destinations, dates), newTripInfoComponent.element);

      render(new TotalCost(this.#calculateTotalPrice(points)), newTripInfoComponent.element);
      this.#tripInfoComponent = newTripInfoComponent;
    } else {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }
  }

  #handleModelChange = (updateType) => {
    if (updateType !== UpdateType.ERROR) {
      this.#renderHeader();
    }
  };
}


