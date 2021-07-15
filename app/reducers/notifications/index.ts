import * as actionTypes from '../../constants/notifications'

export interface INotificationState {
  info: Partial<{
    count: number
    total: number
    new: number
  }>
  data: INotification[]
}

export const notifications = (
  state: INotificationState = { info: {}, data: [] },
  action
) => {
  switch (action.type) {
    case actionTypes.FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case actionTypes.FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        ...action.response,
        isFetching: false
      }
    case actionTypes.RECEIVED_A_NOTIFICATION: {
      if (action.notification.room) {
        // Only global notifications belong to the notification center
        return state
      }

      // Sometimes there is a duplicate socket
      if (
        !state.data.some(
          notification => notification.id === action.notification.id
        )
      ) {
        return {
          ...state,
          data: [action.notification, ...state.data],
          info: {
            count: (state.info.count || 0) + 1,
            total: (state.info.total || 0) + 1,
            new: (state.info.new || 0) + 1
          }
        }
      }

      return state
    }
    case actionTypes.DELETE_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        info: {
          ...state.info,
          new: 0
        }
      }
    case actionTypes.MARK_NOTIFICATION_SEEN_SUCCESS: {
      const notifications = selectNotifications(state)
      const { notificationId } = action

      const newNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, seen: true }
        }

        return notification
      })

      return {
        ...state,
        data: newNotifications,
        isFetching: false
      }
    }
    case actionTypes.MARK_ALL_NOTIFICATIONS_SEEN_SUCCESS: {
      const notifications = selectNotifications(state)

      const newNotifications = notifications.map(notification => {
        if (!notification.seen) {
          return { ...notification, seen: true }
        }

        return notification
      })

      return {
        ...state,
        data: newNotifications,
        isFetching: false
      }
    }
    default:
      return state
  }
}

export const selectNotifications = state => state.data
export const selectNotificationIsFetching = state => state.isFetching
export const selectNotificationNewCount = state => state.info.new || 0
