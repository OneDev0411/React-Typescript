import fecha from 'fecha'
import escape from 'lodash/escape'

import { parseEmailRecipient } from '../../../EmailRecipientsChipsInput/helpers/parse-email-recipient'
import { decodeContentIds } from '../../../EmailThread/helpers/decode-content-ids'
import { EmailThreadEmail } from '../../../EmailThread/types'

/**
 * Creates content of a forward email.
 * @param email
 */
export function getForwardHtml(email: EmailThreadEmail) {
  const { displayName, emailAddress } = parseEmailRecipient(email.from)

  return `
  <br />
  <br />
<div class="rechat-quote">
---------- Forwarded message ---------
  <br />
  From: ${displayName ? `<strong>${displayName}</strong>` : ''} 
      <span dir="auto">${
        displayName ? `&lt;${emailAddress}&gt;` : emailAddress
      }</span>
  <br />
  Date: ${fecha.format(email.date, 'default')}
  <br />
  Subject: ${email.subject || ''}
  <br />
  To: ${escape(email.to.join(', '))}
  <br />
  <br />
  <div>${decodeContentIds(email.attachments, email.htmlBody || '')}</div>
</div>
`
}
