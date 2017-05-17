import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import data from './data'

const appReducer = combineReducers({
  data,
  routing: routerReducer
})

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer
