export function getContactAttribute(contact, attributeDef) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (!attributeDef) {
    throw new Error('Attribute definition is required!')
  }

  let result = []

  if (attributeDef.singular) {
    const attributes = contact.sub_contacts[0].attributes[attributeDef.id]

    if (!isEmpty(attributes)) {
      const sortedByUpdatedAt = attributes.sort(
        (a, b) => a.updated_at < b.updated_at
      )

      result = [sortedByUpdatedAt[0]]
    }
  } else {
    contact.sub_contacts.forEach(subContact => {
      const attributes = subContact.attributes[attributeDef.id]

      if (!isEmpty(attributes)) {
        result = [...result, ...attributes]
      }
    })
  }

  return result
}

function isEmpty(attributes) {
  return !Array.isArray(attributes) || attributes.length === 0
}
