import * as actionTypes from '../../../../constants/deals'

export function updateTasksOrders(
  tasks: ({ id: UUID } & Partial<Omit<IDealTask, 'id'>>)[]
) {
  return {
    type: actionTypes.UPDATE_TASKS_ORDERS,
    tasks
  }
}
