import { combineReducers } from 'redux'
import roles from './roles'

const appReducer = combineReducers({
  roles
})

export default (state, action) => {
  return appReducer(state, action)
}
