import fecha from 'fecha'

import { parseEmailRecipient } from '../../../EmailRecipientsChipsInput/helpers/parse-email-recipient'

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
  Date: ${fecha.format(new Date(email.message_date), 'default')}
  <br />
  Subject: ${email.subject}
  <br />
  To: ${email.to.join(', ')}
  <br />
  <br />
  <div>${email.html_body || ''}</div>
</div>
<br />
`
}
