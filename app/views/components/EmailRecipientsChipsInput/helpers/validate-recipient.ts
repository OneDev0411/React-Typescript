import isEmail from 'validator/lib/isEmail'

import { parseEmailRecipient } from './parse-email-recipient'

export function validateRecipient(
  recipient: IDenormalizedEmailRecipientInput
): string | undefined {
  if (
    recipient.recipient_type === 'Email' &&
    !isEmail(parseEmailRecipient(recipient.email).emailAddress)
  ) {
    return `"${recipient.email}" is not a valid email address`
  }
}
