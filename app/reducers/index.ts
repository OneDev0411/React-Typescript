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
import search from './listings/search'
import alerts from './listings/alerts'
import favorites from './listings/favorites'
import widgets from './widgets'
import confirmation from './confirmation'
import { intercom } from './intercom'
import { tasks } from './tasks'
import { notifications as globalNotifications } from './notifications'
import { AttributeDefsState } from './contacts/attributeDefs'
import { googleAccounts } from './contacts/googleAccounts'

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

  /* calendar */
  calendar,

  /* mls reducers */
  search,
  alerts,
  favorites,

  /* third party reducers */
  notifications: notificationsReducer({
    position: 'br',
    dismissible: true,
    dismissAfter: 4000,
    closeButton: true,
    allowHTML: true
  }),
  form: reduxFormReducer,
  routing: routerReducer
})

// Typings in the Latest redux version allows this beautiful store type inference
// without any extra effort, but in v3.7.2 that we currently use, it doesn't work
// So we can uncomment this line wen migrated to V4.x.x or higher.
// export type IAppState = ReturnType<typeof appReducer>

export type IAppState = {
  contacts: IContactReduxState
  user: IUser
}

export default (state, action) => appReducer(state, action)
