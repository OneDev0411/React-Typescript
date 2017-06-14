import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import data from './data'
import socket from './socket'
import contact from './contact'
import chatroom from './chatroom'
import search from './listings/search'
import listing from './listings/listing'
import favorites from './listings/favorites'

const appReducer = combineReducers({
  socket,
  data,
  search,
  listing,
  contact,
  chatroom,
  favorites,
  routing: routerReducer
})

export default (state, action) => appReducer(state, action)
