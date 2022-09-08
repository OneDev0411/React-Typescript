import { BrandedUser } from '@app/views/components/TeamAgents/types'

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
): Promise<ApiResponseBody<{ code: string; data: BrandedUser }>> {
  try {
    const response = await new Fetch()
      .put(`/contacts/${id}/assignees`)
      .query({
        associations: [
          'contact_role.user',
          'contact_role.brand',
          'contact.assignees'
        ]
      })
      .send(data)

    return response.body
  } catch (error) {
    throw error
  }
}
