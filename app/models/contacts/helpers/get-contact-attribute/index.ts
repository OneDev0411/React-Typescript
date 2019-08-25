import { sortBy } from 'lodash'

export function getContactAttribute(
  contact: INormalizedContact | null,
  attributeDef: IContactAttributeDef | null,
  filter?: (attributeDef: IContactAttributeWithDef) => boolean
) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (!attributeDef) {
    throw new Error('Attribute definition is required!')
  }

  let result: IContactAttributeWithDef[] = []

  if (attributeDef.singular) {
    let attributes = contact.sub_contacts[0].attributes[attributeDef.id]

    if (!isEmpty(attributes)) {
      if (typeof filter === 'function') {
        attributes = attributes.filter(filter)
      }

      const sortedByUpdatedAt = sortBy(attributes, 'updated_at')

      result = [sortedByUpdatedAt.pop()!]
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
