import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

export function deleteEmailTemplate(
  brand: UUID,
  template: UUID
): SuperAgentRequest {
  try {
    return new Fetch()
      .delete(`/brands/${brand}/emails/templates/${template}`)
  } catch (error) {
    throw error
  }
}
