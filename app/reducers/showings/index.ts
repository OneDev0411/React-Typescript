import type {
  DecreaseShowingTotalNotificationCountAction,
  IncreaseShowingTotalNotificationCountAction,
  SetShowingTotalNotificationCountAction
} from 'actions/showings'

export interface IShowingsState {
  totalNotificationCount: Nullable<number>
}

const defaultShowingsState: IShowingsState = {
  totalNotificationCount: null
}

function showingsReducer(
  state: IShowingsState = defaultShowingsState,
  action:
    | SetShowingTotalNotificationCountAction
    | DecreaseShowingTotalNotificationCountAction
    | IncreaseShowingTotalNotificationCountAction
) {
  switch (action.type) {
    case 'SET_SHOWING_TOTAL_NOTIFICATIONS_COUNT':
      return { ...state, totalNotificationCount: action.payload }
    case 'DECREASE_SHOWING_TOTAL_NOTIFICATIONS_COUNT': {
      const totalNotificationCount = state.totalNotificationCount ?? 0
      const newTotalNotificationCount = totalNotificationCount - action.payload

      return {
        ...state,
        totalNotificationCount:
          newTotalNotificationCount > 0 ? newTotalNotificationCount : 0
      }
    }
    case 'INCREASE_SHOWING_TOTAL_NOTIFICATIONS_COUNT': {
      const totalNotificationCount = state.totalNotificationCount ?? 0

      return {
        ...state,
        totalNotificationCount: totalNotificationCount + 1
      }
    }
    default:
      return state
  }
}

export default showingsReducer
