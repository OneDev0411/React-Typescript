import { combineReducers } from 'redux'
import {
  SET_ACTIVE_PANEL,
  SET_PANEL_SORTING_INDEX,
  TOGGLE_PANEL_SORTING_DIRECTION
} from '../../../constants/listings/panels'

const activePanel = (state = 'map', action) => {
  switch (action.type) {
    case SET_ACTIVE_PANEL:
      return action.panelName
    default:
      return state
  }
}

const sortingIndex = (state = 'price', action) => {
  switch (action.type) {
    case SET_PANEL_SORTING_INDEX:
      return action.index
    default:
      return state
  }
}

const sortingDirection = (state = 1, action) => {
  switch (action.type) {
    case TOGGLE_PANEL_SORTING_DIRECTION:
      return state * -1
    default:
      return state
  }
}

const panels = combineReducers({
  activePanel,
  sortingIndex,
  sortingDirection
})

export default panels
