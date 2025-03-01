import TotalCostView from '../view/total-cost-view.js';
import HeaderTitle from '../view/header-title-view.js';
import TripInfoView from '../view/trip-info-view.js';

import { UpdateType } from '../const';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { sortPointByDayUp } from '../utils/helpers.js';

const MAX_DESINATIONS_COUNT = 3;

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
    const newPoints = [...points];
    const sortedPoints = newPoints.sort(sortPointByDayUp);

    const destinations = sortedPoints.map((point) => point.destination);
    const destinationsCount = destinations.length; // Учитываем все элементы, включая дубликаты
    const firstDestination = destinations[0];
    const lastDestination = destinations[destinations.length - 1];

    let secondDestination = null;
    if (destinationsCount >= MAX_DESINATIONS_COUNT) {
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
    const newPoints = [...points];
    const sortedPoints = newPoints.sort(sortPointByDayUp);

    if(sortedPoints.length) {
      return {
        firstDate: sortedPoints[0].dateFrom,
        secondDate: sortedPoints[points.length - 1].dateTo
      };
    }
    return null;
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

      const newTripInfoComponent = new TripInfoView();
      if (previousTripInfoComponent === null) {
        render(newTripInfoComponent, this.#heandlerConteiner, RenderPosition.AFTERBEGIN);
      } else {
        replace(newTripInfoComponent, previousTripInfoComponent);
        remove(previousTripInfoComponent);
      }

      render(new HeaderTitle(destinations, dates), newTripInfoComponent.element);

      render(new TotalCostView(this.#calculateTotalPrice(points)), newTripInfoComponent.element);
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


