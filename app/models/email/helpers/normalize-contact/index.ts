import { Recipient } from 'components/ContactsChipsInput/types'

export function normalizeContactForEmailCompose(
  contact: INormalizedContact
): Recipient[] {
  if (!contact || !contact.summary || !contact.summary.email) {
    return []
  }

  return [
    {
      email: contact.summary.email,
      contact
    }
  ]
}
