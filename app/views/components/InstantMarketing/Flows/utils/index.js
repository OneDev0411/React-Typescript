export function convertRecipientsToEmails(recipients, subject, html) {
  return recipients.map(recipient => ({
    to: recipient.email,
    subject,
    html,
    [recipient.type]: recipient[`${recipient.type}Id`]
  }))
}
