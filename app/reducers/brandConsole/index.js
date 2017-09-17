import { combineReducers } from 'redux'
import roles from './roles'
import checklists from './checklists'
import members from './members'
import brands from './brands'
import spinner from './spinner'

const appReducer = combineReducers({
  roles,
  members,
  checklists,
  brands,
  spinner
})

export default (state, action) => {
  return appReducer(state, action)
}
