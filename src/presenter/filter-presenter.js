import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {FilterType, UpdateType} from '../const.js';
import dayjs from 'dayjs';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  //TODO тут нужно настроить фильтры !!!
  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => {
      let filteredPoints;

      switch (type) {
        case FilterType.PRESENT:
          // Фильтруем точки, которые происходят сейчас (dateFrom <= сейчас <= dateTo)
          filteredPoints = points.filter((point) =>
            dayjs(point.dateFrom).isBefore(dayjs(), 'day') && dayjs(point.dateTo).isAfter(dayjs(), 'day')
          );
          break;
        case FilterType.PAST:
          // Фильтруем точки, которые уже прошли (dateTo < сейчас)
          filteredPoints = points.filter((point) =>
            dayjs(point.dateTo).isBefore(dayjs(), 'day')
          );
          break;
        case FilterType.FUTURE:
          // Фильтруем точки, которые в будущем (dateFrom > сейчас)
          filteredPoints = points.filter((point) =>
            dayjs(point.dateFrom).isAfter(dayjs(), 'day')
          );
          break;
        case FilterType.EVERYTHING:
        default:
          // Возвращаем все точки без изменений
          filteredPoints = points;
          break;
      }

      // Возвращаем объект с типом фильтра и количеством отфильтрованных точек
      return {
        type,
        count: filteredPoints.length,
      };
    });
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
