export function getContactPhone(contact, attributeDefId) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  const avatar = contact.sub_contacts[0].attributes[attributeDefId]

  if (!Array.isArray(avatar) || avatar.length === 0) {
    return null
  }

  return avatar[avatar.length - 1]
}
