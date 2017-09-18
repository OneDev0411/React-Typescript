import { combineReducers } from 'redux'
import roles from './roles'
import checklists from './checklists'
import brands from './brands'
import spinner from './spinner'

const appReducer = combineReducers({
  roles,
  checklists,
  brands,
  spinner
})

export default (state, action) => appReducer(state, action)
