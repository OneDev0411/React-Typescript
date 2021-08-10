import { combineReducers } from 'redux'

import { createNamedWrapperReducer } from '../../../utils/redux-utils'
import map from '../map'
import panels from '../panels'

import feed from './alert-feed'
import list from './list'
import { loggedAlert } from './logged-alert'
import selectedAlertId from './selected-alert-id'

const alerts = combineReducers({
  loggedAlert,
  selectedAlertId,
  map: createNamedWrapperReducer(map, 'alerts'),
  list: createNamedWrapperReducer(list, 'alerts'),
  feed: createNamedWrapperReducer(feed, 'ALERT_FEED'),
  panels: createNamedWrapperReducer(panels, 'alerts')
})

export default alerts
