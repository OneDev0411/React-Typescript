import { OAuthProvider } from 'constants/contacts'

import { updateMessageIsRead } from 'models/email/update-is-read'

export function markThreadAsRead(thread: IEmailThread<'messages'>) {
  const unreadMessages = thread.messages.filter(
    message => message.is_read === false
  )

  unreadMessages.forEach(message => {
    let name
    const id = thread.google_credential || thread.microsoft_credential

    if (thread.google_credential) {
      name = OAuthProvider.Google
    } else if (thread.microsoft_credential) {
      name = OAuthProvider.Outlook
    }

    if (!id) {
      return
    }

    updateMessageIsRead(name, id, message.id, true)
  })
}
