import _ from 'underscore'
import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'

export function normalizeContactAttribute(response) {
  const { data, contact_attribute_defs } = response
  const indexedAttrbuteDefs = _.indexBy(contact_attribute_defs, 'id')
  const contacts = Array.isArray(data) ? data : [data]

  return contacts.map(item => {
    const subContacts = item.sub_contacts.map(subContact => {
      const newAttributes = subContact.attributes.map(attribute => ({
        ...attribute,
        attribute_def: indexedAttrbuteDefs[attribute.attribute_def]
      }))

      const groupByAttributeDef = _.groupBy(
        newAttributes,
        attribute => attribute.attribute_def.id
      )

      const groupBySections = _.groupBy(
        newAttributes,
        attribute => attribute.attribute_def.section
      )

      return {
        ...subContact,
        sections: groupBySections,
        attributes: groupByAttributeDef
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
