import { setActiveTeamSetting } from '@app/store_actions/active-team'

import {
  CHANGE_VIEW_AS_FILTER_REQUEST,
  CHANGE_VIEW_AS_FILTER_SUCCESS,
  CHANGE_VIEW_AS_FILTER_FAILURE
} from '../../../constants/user'

export function setViewAsFilter(value) {
  return async dispatch => {
    try {
      dispatch({
        type: CHANGE_VIEW_AS_FILTER_REQUEST,
        status: true
      })
      dispatch(setActiveTeamSetting('user_filter', value))

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
