import { normalize } from 'normalizr'

import { contactsSchema } from '../../../models/contacts/schema'
import { normalizeContact } from '../../../models/contacts/helpers/normalize-contact'

export function normalizeContactAttribute({
  data
}: ApiResponse<IContact[]>['body']) {
  const contacts = Array.isArray(data) ? data : [data]

  return contacts.map(normalizeContact)
}

export function normalizeContacts(response) {
  const contacts = {
    contacts: normalizeContactAttribute(response)
  }

  return normalize(contacts, contactsSchema)
}
