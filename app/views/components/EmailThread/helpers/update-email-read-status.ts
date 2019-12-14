import { OAuthProvider } from 'constants/contacts'

import { updateMessageIsRead } from 'models/email/update-is-read'

import { EmailThreadEmail } from '../types'

export function updateEmailReadStatus(
  email: EmailThreadEmail,
  status: boolean
) {
  let name
  const id = email.googleId || email.microsoftId

  if (email.googleId) {
    name = OAuthProvider.Google
  } else if (email.microsoftId) {
    name = OAuthProvider.Outlook
  }

  if (!id) {
    return
  }

  updateMessageIsRead(name, id, email.id, status)
}
