import * as actionTypes from '../../constants/inbox'

export interface InboxState {
  readonly unreadEmailThreadsCount:
    | {
        readonly status: 'not fetched'
      }
    | {
        readonly status: 'fetching'
        readonly count?: number
        readonly error?: any
      }
    | {
        readonly status: 'fetched'
        readonly count: number
      }
    | {
        readonly status: 'failed'
        readonly count?: number
        readonly error: any
      }
}

export type InboxAction =
  | {
      type: typeof actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_REQUEST
    }
  | {
      type: typeof actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_SUCCESS
      count: number
    }
  | {
      type: typeof actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_FAILURE
      error: any
    }
