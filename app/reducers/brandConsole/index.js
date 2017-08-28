import { combineReducers } from 'redux'
import roles from './roles'
import checklists from './checklists'
import members from './members'

const appReducer = combineReducers({
  roles,
  members,
  checklists
})

export default (state, action) => {
  return appReducer(state, action)
}
