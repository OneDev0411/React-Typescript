import { isContact } from './type-guards/is-contact'

export function getPersonDisplayName(recipient: IContact | IAgent | undefined): string {
  if (!recipient) {
    return ''
  }
  if (isContact(recipient)) {
    return recipient.display_name
  }

  return `${recipient.first_name} ${recipient.last_name}`
}

