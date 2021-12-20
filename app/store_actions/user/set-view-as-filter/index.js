import { setUserSetting } from '@app/store_actions/user/set-setting'

import {
  CHANGE_VIEW_AS_FILTER_REQUEST,
  CHANGE_VIEW_AS_FILTER_SUCCESS,
  CHANGE_VIEW_AS_FILTER_FAILURE
} from '../../../constants/user'

export function setViewAsFilter(user, value) {
  return async dispatch => {
    try {
      dispatch({
        type: CHANGE_VIEW_AS_FILTER_REQUEST,
        status: true
      })
      dispatch(setUserSetting('user_filter', value))

      dispatch({
        type: CHANGE_VIEW_AS_FILTER_SUCCESS
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: CHANGE_VIEW_AS_FILTER_FAILURE,
        error
      })
    }
  }
}
