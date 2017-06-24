import { combineReducers } from 'redux'
import map from '../map'
import list from './list'
import panels from '../panels'
import feed from './alert-feed'
import selectedAlert from './selected-alert'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'

const alerts = combineReducers({
  selectedAlert,
  map: createNamedWrapperReducer(map, 'ALERTS'),
  list: createNamedWrapperReducer(list, 'ALERTS'),
  feed: createNamedWrapperReducer(feed, 'ALERT_FEED'),
  panels: createNamedWrapperReducer(panels, 'ALERTS')
})

export default alerts
