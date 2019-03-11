export function getContactAttribute(contact, attributeDef, filter) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (!attributeDef) {
    throw new Error('Attribute definition is required!')
  }

  let result = []

  if (attributeDef.singular) {
    let attributes = contact.sub_contacts[0].attributes[attributeDef.id]

    if (!isEmpty(attributes)) {
      if (typeof filter === 'function') {
        attributes = attributes.filter(filter)
      }

      const sortedByUpdatedAt = attributes.sort(
        (a, b) => a.updated_at < b.updated_at
      )

      result = [sortedByUpdatedAt[0]]
    }
  } else {
    contact.sub_contacts.forEach(subContact => {
      let attributes = subContact.attributes[attributeDef.id]

      if (!isEmpty(attributes)) {
        if (typeof filter === 'function') {
          attributes = attributes.filter(filter)
        }

        result = [...result, ...attributes]
      }
    })
  }

  return result
}

function isEmpty(attributes) {
  return !Array.isArray(attributes) || attributes.length === 0
}
