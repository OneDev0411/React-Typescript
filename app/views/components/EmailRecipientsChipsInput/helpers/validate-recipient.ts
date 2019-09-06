import isEmail from 'validator/lib/isEmail'

export function validateRecipient(
  recipient: IDenormalizedEmailRecipientInput
): string | undefined {
  if (recipient.recipient_type === 'Email' && !isEmail(recipient.email)) {
    return `"${recipient.email}" is not a valid email address`
  }
}
