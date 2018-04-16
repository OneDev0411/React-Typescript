// import { addNotification as notify } from 'reapop'
import { addAttributes, updateContact } from '../'

export function upsertContactAttributes(contactId, attributes) {
  let inserts = []
  let updates = []

  // Filter attributes based on their fields.
  // If attribute had a id so it is a patch.
  // Also if it is a singular attribute, it should be patch.
  // But otherwise it is a new attribute and it has to insert.
  attributes.forEach(attribute => {
    const { id, attribute_def } = attribute
    const normalizedAttribute = normalizeAttribute(attribute)

    if (id) {
      updates.push(normalizedAttribute)
    } else if (attribute_def) {
      // todo: add new singular attribute
      if (attribute_def.singular) {
        updates.push(normalizedAttribute)
      } else {
        inserts.push(normalizedAttribute)
      }
    }
  })

  return async dispatch => {
    if (inserts.length > 0) {
      try {
        await dispatch(addAttributes(contactId, inserts))
      } catch (error) {
        throw error
      }
    }

    if (updates.length > 0) {
      try {
        await dispatch(updateContact(contactId, updates))
      } catch (error) {
        throw error
      }
    }
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
