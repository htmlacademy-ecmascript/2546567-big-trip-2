import AbstractView from '../framework/view/abstract-view';

const createTotalCostTemplete = () => (
  '<section class="trip-main__trip-info  trip-info"></section>');

export default class TripInfoView extends AbstractView {
  get template() {
    return createTotalCostTemplete();
  }
}
