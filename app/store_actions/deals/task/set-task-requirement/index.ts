import * as actionTypes from '../../../../constants/deals'
import { changeTaskRequirement } from '../../../../models/Deal/task/change-task-requirement'

export function setTaskRequirement(taskId: UUID, required: boolean) {
  return async dispatch => {
    try {
      await changeTaskRequirement(taskId, required)

      dispatch({
        type: actionTypes.CHANGE_TASK_REQUIREMENT,
        taskId,
        required
      })
    } catch (e) {
      throw e
    }
  }
}
