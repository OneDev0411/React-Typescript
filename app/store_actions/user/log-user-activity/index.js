import postNewActivity from '../../../models/user/post-new-activity'
import * as actionTypes from '../../../constants/user'

export function logUserActivity(activity) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.POST_USER_ACTIVITY_REQUEST
      })

      await postNewActivity(activity)

      dispatch({
        type: actionTypes.POST_USER_ACTIVITY_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.POST_USER_ACTIVITY_FAILURE
      })
      throw error
    }
  }
}
