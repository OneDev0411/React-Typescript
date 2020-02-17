import { OAuthProvider } from 'constants/contacts'

import { setEmailThreadStatus } from 'models/email/set-email-thread-status'

export default async function markEmailThreadAsRead(
  emailThread: IEmailThread<'messages'>
): Promise<void> {
  const unreadMessageIds = emailThread.messages
    .filter(
      m => m.type !== 'email' && !(m as IEmailThreadEmailBase<any>).is_read
    )
    .map(({ id }) => id)

  if (unreadMessageIds.length === 0) {
    return
  }

  if (emailThread.google_credential) {
    await setEmailThreadStatus(
      OAuthProvider.Google,
      emailThread.google_credential,
      unreadMessageIds,
      true
    )
  }

  if (emailThread.microsoft_credential) {
    await setEmailThreadStatus(
      OAuthProvider.Outlook,
      emailThread.microsoft_credential,
      unreadMessageIds,
      true
    )
  }
}
