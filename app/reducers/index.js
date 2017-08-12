import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import data from './data'
import auth from './auth'
import socket from './socket'
import contact from './contact'
import chatroom from './chatroom'
import search from './listings/search'
import alerts from './listings/alerts'
import listing from './listings/listing'
import favorites from './listings/favorites'
import widgets from './widgets'
import { createNamedWrapperReducer } from '../utils/redux-utils'

const appReducer = combineReducers({
  socket,
  data,
  auth,
  search,
  alerts,
  contact,
  chatroom,
  favorites,
  routing: routerReducer,
  listing: createNamedWrapperReducer(listing, 'LISTING'),
  widgets
})

export default (state, action) => appReducer(state, action)
