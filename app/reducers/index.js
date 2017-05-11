import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import data from './data'
import contact from './contact'

const appReducer = combineReducers({
  data,
  contact,
  routing: routerReducer
})

export default(state, action) => {
  return appReducer(state, action)
}
