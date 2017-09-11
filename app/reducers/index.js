import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {reducer as notificationsReducer} from 'reapop'
import data from './data'
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
  contact,
  chatroom,
  widgets,

  /* deals reducers */
  deals,
  brandConsole,

  /* mls reducers */
  search,
  alerts,
  favorites,
  listing: createNamedWrapperReducer(listing, 'LISTING'),

  /* third party reducers */
  notifications: notificationsReducer(),
  routing: routerReducer
})

export default (state, action) => appReducer(state, action)
