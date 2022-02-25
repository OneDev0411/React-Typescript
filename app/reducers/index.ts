import { routerReducer } from 'react-router-redux'
import { reducer as notificationsReducer } from 'reapop'
import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

import activeTeam, { IActiveTeamState } from './active-team'
import auth from './auth'
import brand from './brand'
import chatroom from './chatroom'
import confirmation from './confirmation'
import contacts from './contacts'
import data from './data'
import deals from './deals'
import { emailTemplates } from './email-templates'
import globalTriggers, { IGlobalTriggerState } from './global-triggers'
import { inbox } from './inbox'
import { intercom } from './intercom'
import alerts from './listings/alerts'
import favorites from './listings/favorites'
import search from './listings/search'
import {
  INotificationState,
  notifications as globalNotifications
} from './notifications'
import showings, { IShowingsState } from './showings'
import socket from './socket'
import { tasks } from './tasks'
import user, { IUserState } from './user'
import impersonateUser, { IImpersonateUserState } from './user/impersonate-user'
import widgets from './widgets'

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

  /* active team reducers (aka active user's role) */
  activeTeam,
  /* global-triggers reducer */
  globalTriggers,
  /* we use this user in some place instead of main user */
  impersonateUser,

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
  'user' | 'globalNotifications' | 'showings' | 'globalTriggers'
>

// You have to explicit the reducer types because the above ReturnType can not
// detect the types correctly.
export interface IAppState extends IAppReducer {
  user: IUserState
  globalNotifications: INotificationState
  showings: IShowingsState
  activeTeam: IActiveTeamState
  impersonateUser: IImpersonateUserState
  globalTriggers: IGlobalTriggerState
}

export default (state, action) => {
  return appReducer(state, action)
}
