export function getContactUsers(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  return contact.users || []
}
