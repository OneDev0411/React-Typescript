export function convertRecipientsToEmails(recipients, subject, html) {
  return recipients.map(recipient => ({
    to: recipient.email,
    subject,
    html,
    contact: recipient.contactId,
    [recipient.type]: recipient[`${recipient.type}Id`]
  }))
}
