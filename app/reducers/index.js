import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import data from './data'
import auth from './auth'
import user from './user'
import brand from './brand'
import socket from './socket'
import contact from './contact'
import chatroom from './chatroom'
import deals from './deals'
import brandConsole from './brandConsole'
import search from './listings/search'
import alerts from './listings/alerts'
import listing from './listings/listing'
import favorites from './listings/favorites'
import widgets from './widgets'
import { createNamedWrapperReducer } from '../utils/redux-utils'

const appReducer = combineReducers({
  socket,
  data,
  user,
  auth,
  brand,
  search,
  alerts,
  widgets,
  contact,
  chatroom,
  deals,
  favorites,
  brandConsole,
  routing: routerReducer,
  listing: createNamedWrapperReducer(listing, 'LISTING')
})

export default (state, action) => appReducer(state, action)
