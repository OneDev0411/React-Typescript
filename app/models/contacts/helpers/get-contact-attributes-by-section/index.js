import _ from 'underscore'

export function getContactAttributesBySection(contact, section) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (!section) {
    throw new Error('Section name is required!')
  }

  let list = []

  contact.sub_contacts.forEach(subContact => {
    const attributes = _.flatten(Object.values(subContact.attributes)).filter(
      attribute => attribute.attribute_def.section === section
    )

    list = [...list, ...attributes]
  })

  return list
}
