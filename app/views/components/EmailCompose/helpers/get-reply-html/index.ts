import fecha from 'fecha'
import escape from 'lodash/escape'

import { decodeContentIds } from '../../../EmailThread/helpers/decode-content-ids'
import { EmailThreadEmail } from '../../../EmailThread/types'

/**
 * Creates content of a reply email
 * @param email
 */
export function getReplyHtml(email: EmailThreadEmail) {
  return `
  <br />
  <div class="rechat-quote">
    <div dir="ltr">
    On ${fecha.format(email.date, 'ddd, MMM D, YYYY at h:mm A')} ${escape(
    email.from
  )} wrote:
    <br />  
    </div>
    <blockquote style="margin: 0 0 0 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex">
      ${decodeContentIds(email.attachments, email.htmlBody || '')}
    </blockquote>
  </div>
  `
}
