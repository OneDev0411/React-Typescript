import { batchActions } from 'redux-batched-actions'

import { SET_ACTIVE_BRAND_VIEW_AS } from '../../../constants/brand'
import { putUserSetting } from '../../../models/user/put-user-setting'
import getUserTeams from '../../user/teams'

export function setBrandViewAsFilter(user, value) {
  return async dispatch => {
    try {
      await putUserSetting('user_filter', value)

      batchActions([
        dispatch({
          type: SET_ACTIVE_BRAND_VIEW_AS
        }),
        dispatch(getUserTeams(user, true))
      ])
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
