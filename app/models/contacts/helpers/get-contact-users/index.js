export function getContactUsers(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (!contact.sub_contacts) {
    return []
  }

  let allUsers = []

  contact.sub_contacts.forEach(subContact => {
    const { users } = subContact

    if (Array.isArray(users) && users.length > 0) {
      allUsers = [...allUsers, ...users]
    }
  })

  return allUsers
}
