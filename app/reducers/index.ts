import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxFormReducer } from 'redux-form'
import { reducer as notificationsReducer } from 'reapop'

import data from './data'
import auth from './auth'
import user, { IUserState } from './user'
import brand from './brand'
import socket from './socket'
import contacts from './contacts'
import chatroom from './chatroom'
import deals from './deals'
import search from './listings/search'
import alerts from './listings/alerts'
import favorites from './listings/favorites'
import widgets from './widgets'
import confirmation from './confirmation'
import { intercom } from './intercom'
import { tasks } from './tasks'
import {
  INotificationState,
  notifications as globalNotifications
} from './notifications'
import { emailTemplates } from './email-templates'
import { inbox } from './inbox'
import showings, { IShowingsState } from './showings'

const appReducer = combineReducers({
  socket,
  data,
  user,
  auth,
  brand,
  tasks,
  contacts,
  emailTemplates,
  chatroom,
  widgets,
  intercom,
  confirmation,
  globalNotifications,
  inbox,

  /* deals reducers */
  deals,

  /* mls reducers */
  search,
  alerts,
  favorites,

  /* showings reducers */
  showings,

  /* third party reducers */
  notifications: notificationsReducer(),
  form: reduxFormReducer,
  routing: routerReducer
})

// Typings in the latest redux version allows this beautiful store type inference
// without any extra effort, but in v3.7.2 that we currently use, it doesn't work
// So we can uncomment this line wen migrated to V4.x.x or higher.
// export type IAppState = ReturnType<typeof appReducer>
type IAppReducer = Omit<
  ReturnType<typeof appReducer>,
  'user' | 'globalNotifications' | 'showings'
>

// You have to explicit the reducer types because the above ReturnType can not
// detect the types correctly.
export interface IAppState extends IAppReducer {
  user: IUserState
  globalNotifications: INotificationState
  showings: IShowingsState
}

export default (state, action) => appReducer(state, action)
