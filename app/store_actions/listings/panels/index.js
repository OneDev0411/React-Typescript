import {
  SET_ACTIVE_PANEL,
  SET_PANEL_SORTING_INDEX,
  TOGGLE_PANEL_SORTING_DIRECTION
} from '../../../constants/listings/panels'

export const setActivePanel = (tabName, panelName) => ({
  tabName,
  panelName,
  type: SET_ACTIVE_PANEL
})

export const setPanelSortingIndex = (tabName, index) => ({
  index,
  tabName,
  type: SET_PANEL_SORTING_INDEX
})

export const togglePanelSortingDirection = tabName => ({
  tabName,
  type: TOGGLE_PANEL_SORTING_DIRECTION
})

export default {
  setActivePanel,
  setPanelSortingIndex,
  togglePanelSortingDirection
}
