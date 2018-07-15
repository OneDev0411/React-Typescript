import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function createFormTask(dealId, form, title, checklist) {
  const task_type = 'Form'
  const status = 'Incomplete'

  return async dispatch => {
    try {
      const task = await Deal.createTask(dealId, {
        title,
        status,
        task_type,
        checklist,
        form
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
