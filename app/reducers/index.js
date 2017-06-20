import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import data from './data'
import contact from './contact'
import chatroom from './chatroom'

const appReducer = combineReducers({
  data,
  contact,
  chatroom,
  routing: routerReducer
})

export default(state, action) => {
  return appReducer(state, action)
}
