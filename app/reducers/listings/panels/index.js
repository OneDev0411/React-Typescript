import { combineReducers } from 'redux'
import SET_ACTIVE_PANEL from '../../../constants/listings/panels'

const activePanel = (state = 'map', action) => {
  switch (action.type) {
    case SET_ACTIVE_PANEL:
      return action.panelName
    default:
      return state
  }
}

const panels = combineReducers({
  activePanel
})

export default panels
