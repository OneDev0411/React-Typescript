import Fetch from '../../../../services/fetch'

/**
 * update task
 */
export async function updateTasks(
  dealId: UUID,
  tasks: ({ id: UUID } & Partial<Omit<IDealTask, 'id'>>)[]
): Promise<ApiResponse<IDealTask>> {
  try {
    const response = await new Fetch().put(`/deals/${dealId}/tasks`).send(tasks)

    return response.body.data
  } catch (e) {
    throw e
  }
}
