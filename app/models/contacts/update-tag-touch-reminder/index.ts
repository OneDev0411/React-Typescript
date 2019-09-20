import { SuperAgentRequest } from 'superagent'

import Fetch from '../../../services/fetch'

/**
 * Updates a tag touch frequency (reminder)
 */

export function updateTagTouchReminder(
  tag: string,
  frequency?: number
): SuperAgentRequest {
  try {
    return new Fetch()
      .patch(`/contacts/tags/${tag}/touch`)
      .send({ touch_freq: frequency })
  } catch (error) {
    throw error
  }
}
