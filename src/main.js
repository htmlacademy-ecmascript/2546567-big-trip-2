import { RenderPosition } from './framework/render.js';
import { BoardPresenter } from './presenter/board-presenter.js';
import { destinations } from './presenter/model/destinations-model.js';
import { offersData } from './presenter/model/offer-model.js';
import { points } from './presenter/model/points-model.js';


const tripEventsContainer = document.querySelector('.trip-events');
const ulElement = document.createElement('ul');
ulElement.classList.add('trip-events__list');
tripEventsContainer.insertAdjacentElement(RenderPosition.BEFOREEND, ulElement);

const presenter = new BoardPresenter(points, offersData, destinations);
presenter.init();


