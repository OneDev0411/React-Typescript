import { EmailResponseType } from '../../../EmailThread/types'

export function getReplySubject(
  responseType: EmailResponseType,
  email: IEmailThreadEmail
) {
  const prefix = responseType === 'forward' ? 'Fwd' : 'Re'

  return email.subject && !email.subject.startsWith(prefix)
    ? `${prefix}: ${email.subject || ''}`
    : email.subject || ''
}
