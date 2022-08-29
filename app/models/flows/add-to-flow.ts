import Fetch from '../../services/fetch'

interface Data {
  brand: UUID
  user: UUID
}

export function addAssignee(id, data: Data[]): Promise<ApiResponseBody<any>> {
  try {
    return new Fetch().put(`/contacts/${id}/assignees`).send(data)
  } catch (error) {
    throw error
  }
}
