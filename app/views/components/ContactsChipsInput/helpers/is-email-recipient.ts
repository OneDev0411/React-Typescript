import { EmailRecipient, Recipient } from '../types'

export function isEmailRecipient(input: Recipient): input is EmailRecipient {
  return !!(input as EmailRecipient).email
}
