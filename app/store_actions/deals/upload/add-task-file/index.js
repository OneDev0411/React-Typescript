import * as actionTypes from '../../../../constants/deals'

export function addTaskFile(task_id, file) {
  return {
    type: actionTypes.ADD_TASK_FILE,
    task_id,
    file
  }
}
