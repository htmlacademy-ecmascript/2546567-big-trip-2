import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { filter, sortPointByDayUp, sortPointByEventUp, sortPointByOffersUp, sortPointByPriceUp, sortPointByTimeDiffUp } from '../utils/helpers.js';
import ErrorMessageView from '../view/error-message-view.js';
import LoadingView from '../view/loading-view.js';
import NoPointView from '../view/no-point.view.js';
import PointListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import NewPointPresenter from './new-point-presenter.js';
import PointPresenter from './point-presenter.js';

const POINT_COUNT_PER_STEP = 30;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #errorMessageComponent = new ErrorMessageView();
  #noPointComponent = null;
  #sortComponent = null;

  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({boardContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
      onCancel: this.#onCancelBtnClick.bind(this),
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;

    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointByDayUp);
      case SortType.EVENT:
        return filteredPoints.sort(sortPointByEventUp);
      case SortType.TIME:
        return filteredPoints.sort(sortPointByTimeDiffUp);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointByPriceUp);
      case SortType.OFFER:
        return filteredPoints.sort(sortPointByOffersUp);
    }

    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();

    if (this.#noPointComponent && !this.#pointsModel.points.length) {
      remove(this.#noPointComponent);
    }
  }

  #onCancelBtnClick() {
    if (this.#pointsModel.points.length === 0) {
      this.#noPointComponent = new NoPointView({
        filterType: this.#filterType
      });

      render(this.#noPointComponent, this.#boardContainer, RenderPosition.AFTEREND);
    }
  }

  #handleModelEvent = (updateType, data) => {
    this.#isError = false;
    switch (updateType) {
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#isError = true;
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedPointCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {

    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
          this.#isLoading = false;
          remove(this.#loadingComponent);

        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#isLoading = false;
          remove(this.#loadingComponent);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
          this.#isLoading = false;
          remove(this.#loadingComponent);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderErrorMessage() {
    render(this.#errorMessageComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedPointCount: true});
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({resetRenderedPointCount = false, resetSortType = false} = {}) {
    const pointCount = this.points.length;

    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    // remove(this.#boardComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetRenderedPointCount) {
      this.#renderedPointCount = POINT_COUNT_PER_STEP;
    } else {
      this.#renderedPointCount = Math.min(pointCount, this.#renderedPointCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    // Очищаем содержимое контейнера перед рендером
    this.#boardContainer.innerHTML = '';

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isError) {
      this.#renderErrorMessage();
      return;
    }

    const points = this.points;
    const pointCount = points?.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
    }

    this.#renderSort();
    render(this.#pointListComponent, this.#boardContainer);

    this.#renderPoints(points.slice(0, Math.min(pointCount, this.#renderedPointCount)));
  }
}
export { BoardPresenter };
