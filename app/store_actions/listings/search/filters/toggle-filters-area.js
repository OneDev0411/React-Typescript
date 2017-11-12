import {
  TOGGLE_FILTERS_AREA,
  HIDE_FILTERS_AREA,
  SHOW_FILTERS_AREA
} from '../../../../constants/listings/search/filters'

export const toggleFilterArea = () => ({
  type: TOGGLE_FILTERS_AREA
})

export const showFilterArea = () => ({
  type: SHOW_FILTERS_AREA
})

export const hideFilterArea = () => ({
  type: HIDE_FILTERS_AREA
})

export default toggleFilterArea
