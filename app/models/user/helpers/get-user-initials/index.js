import { getNameInitials } from '../../../../utils/helpers'

function getFirstWord(text) {
  if (typeof text !== 'string') {
    return ''
  }

  return text.split(' ')[0]
}

export function getUserInitials(user) {
  if (!user) {
    throw new Error('User object is required!')
  }

  const { first_name, last_name } = user

  return getNameInitials(
    `${getFirstWord(first_name)} ${getFirstWord(last_name)}`
  )
}
