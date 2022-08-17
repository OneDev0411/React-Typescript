import Fetch from '../../services/fetch'

/**
 * Adds contacts to a CRM flow
 */

interface Data {
  brand: UUID
  user: UUID
}

export async function addAssignee(
  id: UUID,
  data: { assignees: Data[] }
): Promise<ApiResponseBody<any>> {
  try {
    const response = await new Fetch()
      .put(`/contacts/${id}/assignees`)
      .send(data)

    return response.body.data
  } catch (error) {
    throw error
  }
}
