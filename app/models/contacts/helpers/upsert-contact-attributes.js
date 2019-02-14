import { addAttributes } from '../add-attributes'
import { updateContact } from '../update-contact'
import { normalizeContact } from './normalize-contact'

export async function upsertContactAttributes(contactId, attributes, query) {
  let inserts = []
  let updates = []

  // Filter attributes based on their fields.
  // If attribute had a id so it is a patch.
  // But otherwise it is a new attribute and it has to insert.
  attributes.forEach(attribute => {
    const normalizedAttribute = normalizeAttribute(attribute)

    if (attribute.id) {
      updates.push(normalizedAttribute)
    } else {
      inserts.push(normalizedAttribute)
    }
  })

  let requests = []

  try {
    if (inserts.length > 0) {
      requests.push(addAttributes(contactId, inserts, query))
    }

    if (updates.length > 0) {
      requests.push(updateContact(contactId, updates, query))
    }

    const response = await Promise.all(requests)

    let newContact = {}

    response.forEach(res => {
      newContact = {
        ...newContact,
        ...res.data
      }
    })

    return normalizeContact(newContact)
  } catch (error) {
    console.log(error)
    throw error
  }
}

function normalizeAttribute(attribute) {
  const { attribute_def } = attribute

  if (attribute_def && attribute_def.id) {
    return {
      ...attribute,
      attribute_def: attribute_def.id
    }
  }

  return attribute
}
