import { getContact } from '../get-contact'
import { deleteAttributesFromContacts } from '../delete-attributes-bulk-contacts'
import { normalizeContact } from './normalize-contact'

export async function deleteContactAttributes(contactId, ids, query) {
  if (!contactId) {
    throw new Error('ContactId is not valid!')
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('Invalid array of ids')
  }

  try {
    await deleteAttributesFromContacts(ids)

    const response = await getContact(contactId, query)

    return normalizeContact(response.data)
  } catch (error) {
    throw error
  }
}
