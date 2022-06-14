import { SuperAgentRequest } from 'superagent'

import Fetch from '../../../services/fetch'

/**
 * Updates a contact touch frequency (reminder)
 */

export function updateContactTouchReminder(
  id: UUID,
  frequency: Nullable<number>
): SuperAgentRequest {
  try {
    return new Fetch()
      .patch(`/contacts/${id}/touch`)
      .send({ touch_freq: frequency })
  } catch (error) {
    throw error
  }
}
