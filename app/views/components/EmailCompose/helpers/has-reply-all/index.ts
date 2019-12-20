import { EmailThreadEmail } from '../../../EmailThread/types'

/**
 * @returns if replyAll is available for a given email, based on its recipients
 */
export function hasReplyAll(email: EmailThreadEmail) {
  return [...email.to, ...email.cc].length > 1
}
