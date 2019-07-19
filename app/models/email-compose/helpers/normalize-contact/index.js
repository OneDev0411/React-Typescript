import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

function normalizeContactForEmailCompose(contact, attributeDefs, options = {}) {
  if (!contact) {
    return []
  }

  const emails = getContactAttribute(
    contact,
    selectDefinitionByName(attributeDefs, 'email')
  )

  if (emails.length === 0) {
    return []
  }

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

export default normalizeContactForEmailCompose
