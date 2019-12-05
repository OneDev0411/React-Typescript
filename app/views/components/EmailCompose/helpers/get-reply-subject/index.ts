import { EmailResponseType } from '../../../EmailThread/types'

export function getReplySubject(
  responseType: EmailResponseType,
  subject: string
) {
  const prefix = responseType === 'forward' ? 'Fwd' : 'Re'

  return subject && !subject.startsWith(prefix)
    ? `${prefix}: ${subject || ''}`
    : subject || ''
}
