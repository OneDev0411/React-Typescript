import isEmail from 'validator/lib/isEmail'

import { Recipient } from '../types'
import { isEmailRecipient } from './is-email-recipient'

export function validateRecipient(recipient: Recipient): string | undefined {
  if (isEmailRecipient(recipient) && !isEmail(recipient.email)) {
    return `"${recipient.email}" is not a valid email address`
  }
}
