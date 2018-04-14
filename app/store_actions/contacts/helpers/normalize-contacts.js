import _ from 'underscore'
import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'

export function normalizeContactAttribute(response) {
  const { data, contact_attribute_defs } = response
  const indexedAttrbuteDefs = _.indexBy(contact_attribute_defs, 'id')
  const contacts = Array.isArray(data) ? data : [data]

  return contacts.map(item => {
    const subContacts = item.sub_contacts.map(sub => {
      const { attributes } = sub
      const newAttributes = _.chain(attributes)
        .map(attr => ({
          ...attr,
          attribute_def: indexedAttrbuteDefs[attr.attribute_def]
        }))
        .groupBy(attribute => attribute.attribute_def.section)
        .value()

      return {
        ...sub,
        attributes: newAttributes
      }
    })

    return {
      ...item,
      sub_contacts: subContacts
    }
  })
}

export function normalizeContacts(response) {
  const contacts = {
    contacts: normalizeContactAttribute(response)
  }

  return normalize(contacts, contactsSchema)
}
