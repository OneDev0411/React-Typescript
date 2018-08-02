import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function updateTask(taskId, attributes) {
  return async dispatch => {
    try {
      const task = await Deal.updateTask(taskId, attributes)

      dispatch({
        type: actionTypes.UPDATE_TASK,
        task
      })
    } catch (e) {
      throw e
    }
  }
}
