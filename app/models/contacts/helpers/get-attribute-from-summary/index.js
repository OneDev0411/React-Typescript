export function getAttributeFromSummary(contact, attributeName) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (!attributeName) {
    throw new Error('Attribute name is required!')
  }

  return contact.summary[attributeName] || null
}
