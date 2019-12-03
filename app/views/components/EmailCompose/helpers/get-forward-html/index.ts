import fecha from 'fecha'
import escape from 'lodash/escape'

import { parseEmailRecipient } from '../../../EmailRecipientsChipsInput/helpers/parse-email-recipient'
import { decodeContentIds } from '../../../EmailThread/helpers/decode-content-ids'

/**
 * Creates content of a forward email.
 * @param email
 */
export function getForwardHtml(email: IEmailThreadEmail) {
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
  Date: ${fecha.format(new Date(email.message_date * 1000), 'default')}
  <br />
  Subject: ${email.subject || ''}
  <br />
  To: ${escape(email.to.join(', '))}
  <br />
  <br />
  <div>${decodeContentIds(email.attachments, email.html_body || '')}</div>
</div>
`
}
