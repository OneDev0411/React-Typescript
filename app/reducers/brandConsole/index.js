import { combineReducers } from 'redux'
import roles from './roles'
import members from './members'

const appReducer = combineReducers({
  roles,
  members
})

export default (state, action) => {
  return appReducer(state, action)
}
