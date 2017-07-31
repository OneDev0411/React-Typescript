import types from '../../constants/deals'
import Deal from '../../models/Deal'

function addNewTask(deal_id, task) {
  return {
    type: types.CREATE_TASK,
    deal_id,
    task
  }
}

export function createTask(deal_id, form, title, status, task_type, tags) {
  return async (dispatch) => {
    const task = await Deal.createTask(deal_id, form, title, status, task_type, tags)

    dispatch(addNewTask(deal_id, task))
  }
}
