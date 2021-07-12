import type { IAppState } from 'reducers'
import type { INotificationState } from 'reducers/notifications'

/**
 * Returns the entire global notification object from store
 * @param state The app state
 */
function getGlobalNotifications(state: IAppState): INotificationState {
  return state.globalNotifications
}

/**
 * Returns the updated notifications list
 * @param state The app state
 */
export function getGlobalNotificationsList(state: IAppState): INotification[] {
  return getGlobalNotifications(state).data
}
