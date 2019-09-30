import fecha from 'fecha'

/**
 * Creates content of a reply email
 * @param email
 */
export function getReplyHtml(email: IEmailThreadEmail) {
  return `
  <br />
  <div class="rechat-quote">
    <div dir="ltr">
    On ${fecha.format(
      new Date(email.message_date),
      'ddd, MMM D, YYYY at h:mm A'
    )} ${email.from} wrote:
    </div>
    <blockquote style="margin: 0 0 0 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex">
      ${email.html_body || ''}
    </blockquote>
  </div>
  `
}
