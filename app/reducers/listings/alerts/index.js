import { combineReducers } from 'redux'
import map from '../map'
import panels from '../panels'
import list from './list'
import selectedAlert from './selectedAlert'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'

const alerts = combineReducers({
  selectedAlert,
  map: createNamedWrapperReducer(map, 'ALERTS'),
  list: createNamedWrapperReducer(list, 'ALERTS'),
  panels: createNamedWrapperReducer(panels, 'ALERTS')
})

export default alerts
