import { getNameInitials } from '../../../../utils/helpers'

function getFirstWord(text) {
  if (typeof text !== 'string') {
    return ''
  }

  return text.split(' ')[0]
}

export function getContactNameInitials(contact) {
  if (!contact || !contact.display_name) {
    return ''
  }

  return getNameInitials(`${getFirstWord(contact.display_name)}}`)
}
