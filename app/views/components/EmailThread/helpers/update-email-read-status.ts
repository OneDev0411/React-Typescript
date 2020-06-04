import { setEmailMessagesReadStatus } from 'models/email/set-email-messages-read-status'

import { EmailThreadEmail } from '../types'

export function updateEmailReadStatus(
  email: EmailThreadEmail,
  status: boolean
) {
  const id = email.googleId || email.microsoftId

  if (!id) {
    return
  }

  setEmailMessagesReadStatus([email.id], status)
}
