export function getAttributsByDefId(contact, attributeDefId) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  const attribute = contact.sub_contacts[0].attributes[attributeDefId]

  if (!Array.isArray(attribute) || attribute.length === 0) {
    return []
  }

  return attribute[attribute.length - 1]
}
