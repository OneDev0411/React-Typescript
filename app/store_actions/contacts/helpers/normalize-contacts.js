import _ from 'underscore'
import { normalize } from 'normalizr'

import { contactsSchema } from '../../../models/contacts/schema'

export function normalizeContact(contact) {
  const subContacts = contact.sub_contacts.map(subContact => {
    const groupByAttributeDef = _.groupBy(
      subContact.attributes,
      attribute => attribute.attribute_def.id
    )

    const groupBySections = _.groupBy(
      subContact.attributes,
      attribute => attribute.attribute_def.section
    )

    return {
      ...subContact,
      sections: groupBySections,
      attributes: groupByAttributeDef
    }
  })

  return {
    ...contact,
    sub_contacts: subContacts
  }
}

export function normalizeContactAttribute({ data }) {
  const contacts = Array.isArray(data) ? data : [data]

  return contacts.map(normalizeContact)
}

export function normalizeContacts(response) {
  const contacts = {
    contacts: normalizeContactAttribute(response)
  }

  return normalize(contacts, contactsSchema)
}
