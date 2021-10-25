import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function updateTasks(
  dealId: UUID,
  tasks: ({ id: UUID } & Partial<Omit<IDealTask, 'id'>>)[]
) {
  return async dispatch => {
    try {
      const task = await Deal.updateTasks(dealId, tasks)

      dispatch({
        type: actionTypes.UPDATE_TASKS,
        task
      })
    } catch (e) {
      throw e
    }
  }
}
