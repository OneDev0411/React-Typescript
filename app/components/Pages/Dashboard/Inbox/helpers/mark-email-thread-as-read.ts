import { OAuthProvider } from 'constants/contacts'

import { setEmailReadStatus } from 'models/email/set-email-read-status'

export default async function markEmailThreadAsRead(
  emailThread: IEmailThread<'messages'>
): Promise<void> {
  await Promise.all(
    emailThread.messages
      .filter(
        m => m.type !== 'email' && !(m as IEmailThreadEmailBase<any>).is_read
      )
      .map(m => {
        switch (m.type) {
          case 'google_message':
            return setEmailReadStatus(
              OAuthProvider.Google,
              m.google_credential,
              m.id
            )

          case 'microsoft_message':
            return setEmailReadStatus(
              OAuthProvider.Outlook,
              m.microsoft_credential,
              m.id
            )

          default:
            throw new Error('Invalid message.')
        }
      })
  )
}
