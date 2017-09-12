import { combineReducers } from 'redux'
import roles from './roles'
import checklists from './checklists'
import members from './members'
import brands from './brands'

const appReducer = combineReducers({
  roles,
  members,
  checklists,
  brands
})

export default (state, action) => {
  return appReducer(state, action)
}
