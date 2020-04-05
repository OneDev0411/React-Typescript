import { InboxState, InboxAction } from './types'
import * as actionTypes from '../../constants/inbox'

const initialState: InboxState = {
  unreadEmailThreadsCount: {
    status: 'not fetched'
  }
}

export function inbox(
  state: InboxState = initialState,
  action: InboxAction
): InboxState {
  switch (action.type) {
    case actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_REQUEST:
      return {
        ...state,
        unreadEmailThreadsCount: {
          ...state.unreadEmailThreadsCount,
          status: 'fetching'
        }
      }

    case actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_SUCCESS:
      return {
        ...state,
        unreadEmailThreadsCount: {
          status: 'fetched',
          count: action.count
        }
      }

    case actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_FAILURE:
      return {
        ...state,
        unreadEmailThreadsCount: {
          ...state.unreadEmailThreadsCount,
          status: 'failed',
          error: action.error
        }
      }

    default:
      return state
  }
}

export function selectUnreadEmailThreadsCount(
  state: InboxState
): number | undefined {
  return state.unreadEmailThreadsCount.status === 'fetching' ||
    state.unreadEmailThreadsCount.status === 'fetched' ||
    state.unreadEmailThreadsCount.status === 'failed'
    ? state.unreadEmailThreadsCount.count
    : undefined
}
export function selectUnreadEmailThreadsError(
  state: InboxState
): string | undefined {
  return state.unreadEmailThreadsCount.status === 'fetching' ||
    state.unreadEmailThreadsCount.status === 'failed'
    ? String(state.unreadEmailThreadsCount.error)
    : undefined
}
export function selectUnreadEmailThreadsIsFetching(state: InboxState): boolean {
  return state.unreadEmailThreadsCount.status === 'fetching'
}
