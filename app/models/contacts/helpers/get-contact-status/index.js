import { getContactUsers } from '../get-contact-users'

export function getContactStatus(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (!contact.sub_contacts) {
    throw new Error('Contact object is not valid!')
  }

  const users = getContactUsers(contact)

  if (users.length === 0) {
    return undefined
  }

  const latestOnlineUser = users.reduce(
    (a, b) => (a.last_seen_at > b.last_seen_at ? a : b)
  )

  if (latestOnlineUser) {
    return {
      last_seen_at: latestOnlineUser.last_seen_at,
      last_seen_by: latestOnlineUser.last_seen_by
    }
  }

  return undefined
}
