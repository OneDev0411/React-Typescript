import { getNameInitials } from '../../../../utils/helpers'
import { selectDefinitionByName } from '../../../../reducers/contacts/attributeDefs'
import { getContactAttribute } from '../get-contact-attribute'

function getFirstWord(text) {
  if (typeof text !== 'string') {
    return ''
  }

  return text.split(' ')[0]
}

export function getContactNameInitials(contact, attributeDefs) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (contact.summary) {
    return getNameInitials(
      `${getFirstWord(contact.summary.first_name)} ${getFirstWord(
        contact.summary.last_name
      )}`
    )
  }

  const firstNameAttributes = getContactAttribute(
    contact,
    selectDefinitionByName(attributeDefs, 'first_name')
  )
  const lastNameAttributes = getContactAttribute(
    contact,
    selectDefinitionByName(attributeDefs, 'last_name')
  )

  return getNameInitials(
    `${getFirstWord(firstNameAttributes[0].text)} ${getFirstWord(
      lastNameAttributes[0].text
    )}`
  )
}
