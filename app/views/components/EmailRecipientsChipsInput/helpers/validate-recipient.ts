import isEmail from 'validator/lib/isEmail'

import { getEmailAddressFromEmailRecipient } from './get-email-address-from-email-recipient'

export function validateRecipient(
  recipient: IDenormalizedEmailRecipientInput
): string | undefined {
  if (
    recipient.recipient_type === 'Email' &&
    !isEmail(getEmailAddressFromEmailRecipient(recipient.email))
  ) {
    return `"${recipient.email}" is not a valid email address`
  }
}
