import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from '../../../../../constants/oauth-accounts'

import { EmailThreadChangeEvent } from '../types'

export default function skipEmailThreadChangeEvent(
  event: EmailThreadChangeEvent,
  allConnectedAccounts: IOAuthAccount[]
): boolean {
  // This should never happen, but we check it due to a bug in the server.
  if (event.threads.length === 0) {
    return true
  }

  if (GOOGLE_CREDENTIAL in event) {
    return allConnectedAccounts.every(
      ({ id }) => id !== event[GOOGLE_CREDENTIAL]
    )
  }

  if (MICROSOFT_CREDENTIAL in event) {
    return allConnectedAccounts.every(
      ({ id }) => id !== event[MICROSOFT_CREDENTIAL]
    )
  }

  return true
}
