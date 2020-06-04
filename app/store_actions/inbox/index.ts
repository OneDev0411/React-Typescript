import { ThunkDispatch } from 'redux-thunk'

import { InboxAction } from 'reducers/inbox/types'

import * as actionTypes from '../../constants/inbox'

import { getUnreadEmailThreadsCount } from '../../models/email/get-unread-email-threads-count'

export function fetchUnreadEmailThreadsCount() {
  return async (dispatch: ThunkDispatch<any, any, InboxAction>) => {
    try {
      dispatch({
        type: actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_REQUEST
      })

      const count = await getUnreadEmailThreadsCount()

      dispatch({
        type: actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_SUCCESS,
        count
      })
    } catch (error) {
      dispatch({
        type: actionTypes.FETCH_UNREAD_EMAIL_THREADS_COUNT_FAILURE,
        error
      })

      throw error
    }
  }
}
