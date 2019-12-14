import { updateMessageIsRead } from 'models/email/update-is-read'

export function markThreadAsRead(thread: IEmailThread<'messages'>) {
  const unreadMessages = thread.messages.filter(
    message => message.is_read === false
  )

  unreadMessages.forEach(message => {
    let mailServerName
    let credentialId

    if (thread.google_credential) {
      mailServerName = 'google'
      credentialId = thread.google_credential
    }

    if (thread.microsoft_credential) {
      mailServerName = 'microsoft'
      credentialId = thread.microsoft_credential
    }

    if (!credentialId) {
      return
    }

    updateMessageIsRead(mailServerName, credentialId, message.id, true)
  })
}
