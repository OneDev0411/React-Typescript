import * as actionTypes from '../../../../constants/deals'
import { createTask as create } from '../../../../models/Deal/task/create-task'

export function createTask({
  dealId,
  taskTitle,
  checklistId,
  taskType,
  taskStatus = 'Incomplete'
}) {
  return async dispatch => {
    try {
      const task = await create(dealId, {
        title: taskTitle,
        status: taskStatus,
        checklist: checklistId,
        task_type: taskType
      })

      dispatch({
        type: actionTypes.CREATE_TASK,
        deal_id: dealId,
        list_id: checklistId,
        task
      })

      return task
    } catch (e) {
      throw e
    }
  }
}
