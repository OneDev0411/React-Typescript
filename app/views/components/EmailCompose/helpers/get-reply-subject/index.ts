import { EmailResponseType } from '../../../EmailThread/types'

export function getReplySubject(
  responseType: EmailResponseType,
  email: IEmailThreadEmail
) {
  const prefix = responseType === 'reply' ? 'Re' : 'Fwd'

  return !email.subject.startsWith(prefix)
    ? `${prefix}: ${email.subject}`
    : email.subject
}
