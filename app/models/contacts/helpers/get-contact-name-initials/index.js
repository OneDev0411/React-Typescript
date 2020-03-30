import { getNameInitials } from '../../../../utils/helpers'

function getFirstWord(text) {
  if (typeof text !== 'string') {
    return ''
  }

  return text.split(' ')[0]
}

export function getContactNameInitials(contact) {
  if (!contact || !contact.first_name) {
    return ''
  }

  return getNameInitials(`${getFirstWord(contact.first_name)}}`)
}
