import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function createGenericTask(dealId, title, checklist) {
  const status = 'Incomplete'
  const task_type = 'Generic'

  return async dispatch => {
    try {
      const task = await Deal.createTask(dealId, {
        title,
        status,
        task_type,
        checklist
      })

      dispatch({
        type: actionTypes.CREATE_TASK,
        deal_id: dealId,
        list_id: checklist,
        task
      })

      return task
    } catch (e) {
      throw e
    }
  }
}
