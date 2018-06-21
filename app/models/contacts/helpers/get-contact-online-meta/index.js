import { getContactUsers } from '../get-contact-users'

export function getContactOnlineMeta(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
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
      last_seen_type: latestOnlineUser.last_seen_type
    }
  }

  return undefined
}
