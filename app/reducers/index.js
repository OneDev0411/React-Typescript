import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import data from './data'
import socket from './socket'
import contact from './contact'
import chatroom from './chatroom'

const appReducer = combineReducers({
  socket,
  data,
  contact,
  chatroom,
  routing: routerReducer
})

export default (state, action) => appReducer(state, action)
