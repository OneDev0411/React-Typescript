import { getContactUsers } from '../get-contact-users'
import { isOnline } from '../../../../utils/user'

export function getContactOnlineStatus(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  const users = getContactUsers(contact)

  if (users.length === 0) {
    return false
  }

  return users.some(isOnline)
}
