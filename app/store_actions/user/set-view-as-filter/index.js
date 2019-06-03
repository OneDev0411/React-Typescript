import { batchActions } from 'redux-batched-actions'

import {
  CHANGE_VIEW_AS_FILTER_REQUEST,
  CHANGE_VIEW_AS_FILTER_SUCCESS,
  CHANGE_VIEW_AS_FILTER_FAILURE
} from '../../../constants/user'
import { putUserSetting } from '../../../models/user/put-user-setting'

import { getUserTeams } from '../teams'

export function setViewAsFilter(user, value) {
  return async dispatch => {
    try {
      dispatch({
        type: CHANGE_VIEW_AS_FILTER_REQUEST,
        status: true
      })

      await putUserSetting('user_filter', value)

      batchActions([
        await dispatch(getUserTeams(user)),
        dispatch({
          type: CHANGE_VIEW_AS_FILTER_SUCCESS
        })
      ])
    } catch (error) {
      console.log(error)
      dispatch({
        type: CHANGE_VIEW_AS_FILTER_FAILURE,
        error
      })
    }
  }
}
