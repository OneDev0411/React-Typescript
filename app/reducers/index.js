import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as notificationsReducer } from 'reapop'
import { reducer as reduxFormReducer } from 'redux-form'

import data from './data'
import auth from './auth'
import user from './user'
import brand from './brand'
import socket from './socket'
import contacts from './contacts'
import chatroom from './chatroom'
import deals from './deals'
import calendar from './calendar'
import brandConsole from './brandConsole'
import search from './listings/search'
import alerts from './listings/alerts'
import favorites from './listings/favorites'
import widgets from './widgets'
import confirmation from './confirmation'
import { intercom } from './intercom'
import { tasks } from './tasks'
import { notifications as globalNotifications } from './notifications'

const appReducer = combineReducers({
  socket,
  data,
  user,
  auth,
  brand,
  tasks,
  contacts,
  chatroom,
  widgets,
  intercom,
  confirmation,
  globalNotifications,
  /* deals reducers */
  deals,
  brandConsole,

  /* calendar */
  calendar,

  /* mls reducers */
  search,
  alerts,
  favorites,

  /* third party reducers */
  notifications: notificationsReducer(),
  form: reduxFormReducer,
  routing: routerReducer
})

export default (state, action) => appReducer(state, action)
