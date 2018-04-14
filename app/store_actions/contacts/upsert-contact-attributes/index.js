// import { addNotification as notify } from 'reapop'
import { addAttributes, updateContact } from '../'

export function upsertContactAttributes(contactId, attributes) {
  const updates = attributes.filter(attr => attr.id)
  const inserts = attributes.filter(attr => !attr.id)

  return async dispatch => {
    // insert new attributes
    if (inserts.length > 0) {
      try {
        await dispatch(addAttributes(contactId, inserts))
      } catch (error) {
        throw error
      }
    }

    // update attributes
    if (updates.length > 0) {
      try {
        await dispatch(updateContact(contactId, updates))
      } catch (error) {
        throw error
      }
    }
  }
}
