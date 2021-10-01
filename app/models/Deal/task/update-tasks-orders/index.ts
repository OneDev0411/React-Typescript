import Fetch from '../../../../services/fetch'

/**
 * update tasks orders
 */
export async function updateChecklistTasksOrders(
  dealId: UUID,
  checklistId: UUID,
  tasks: { id: UUID; order: number }[]
): Promise<ApiResponse<IDealChecklist>> {
  try {
    const response = await new Fetch()
      .put(`/deals/${dealId}/checklists/${checklistId}/sort`)
      .send(tasks)

    return response.body.data
  } catch (e) {
    throw e
  }
}
