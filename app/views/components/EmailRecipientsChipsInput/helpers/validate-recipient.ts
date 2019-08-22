import isEmail from 'validator/lib/isEmail'

import { isEmailRecipient } from './is-email-recipient'

export function validateRecipient(
  recipient: IDenormalizedEmailRecipientInput
): string | undefined {
  if (isEmailRecipient(recipient) && !isEmail(recipient.email)) {
    return `"${recipient.email}" is not a valid email address`
  }
}
