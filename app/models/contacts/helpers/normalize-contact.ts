import _ from 'underscore'

export function normalizeContact(contact: IContact): INormalizedContact {
  const groupByAttributeDef = _.groupBy(
    contact.attributes || [],
    attribute => attribute.attribute_def.id
  )

  const groupBySections = _.groupBy(
    contact.attributes || [],
    attribute => attribute.attribute_def.section
  )

  return {
    ...contact,
    sub_contacts: [
      {
        id: contact.id,
        brand: contact.brand,
        created_at: contact.created_at,
        type: 'sub_contact',

        sections: groupBySections,
        attributes: groupByAttributeDef
      }
    ]
  }
}
