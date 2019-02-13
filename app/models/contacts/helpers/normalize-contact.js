import _ from 'underscore'

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
