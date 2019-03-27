import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

export function normalizeContact(contact, attributeDefs, options = {}) {
  if (!contact) {
    return []
  }

  const emails = getContactAttribute(
    contact,
    selectDefinitionByName(attributeDefs, 'email')
  )

  return [
    {
      data_type: 'contact',
      contactId: contact.id,
      name: contact.summary.display_name,
      avatar: contact.summary.profile_image_url,
      email: contact.summary.email,
      emails: emails.map(email => email.text),
      readOnly: options.readOnly || false
    }
  ]
}
