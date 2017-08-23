import { combineReducers } from 'redux'
import roles from './roles'
import checklists from './checklists'
// import tasks from './tasks'
import members from './members'

const appReducer = combineReducers({
  roles,
  members,
  checklists,
  // tasks
})

export default (state, action) => {
  return appReducer(state, action)
}
