import { getDisplayNameForContactEmail } from './get-display-name-for-contact-email'

export function recipientToString(
  recipient: IDenormalizedEmailRecipientInput
): string {
  if (recipient.recipient_type === 'List') {
    return `${recipient.list.name} (List)`
  }

  if (recipient.recipient_type === 'Tag') {
    return `${recipient.tag.text} (Tag)`
  }

  if (recipient.recipient_type === 'Agent') {
    return recipient.agent.full_name || recipient.agent.email
  }

  if (recipient.recipient_type === 'Email' && recipient.email) {
    if (!recipient.contact || !recipient.contact.display_name) {
      // If email is in form of "Display Name <email address>", we replace
      // angle brackets with parenthesis
      return recipient.email.replace('<', '(').replace('>', ')')
    }

    // We have a contact here which has a display name.
    // if it has multiple emails, show email in parentheses. Otherwise, only name
    const emails: string[] = recipient.contact.emails || []

    const showEmail =
      emails.length > 1 && recipient.contact.display_name !== recipient.email

    // if all other emails are for different domains, then it's sufficient
    // to show the domain only, like Gmail
    const onlyShowDomain = emails.every(
      anEmail =>
        anEmail === recipient.email ||
        getEmailDomain(anEmail) !== getEmailDomain(recipient.email)
    )

    return (
      getDisplayNameForContactEmail(recipient.email, recipient.contact) +
      (showEmail
        ? ` (${recipient.email
            .split('@')
            .slice(onlyShowDomain ? 1 : 0)
            .join('@')})`
        : '')
    )
  }

  if (recipient.recipient_type === 'AllContacts') {
    return 'All My Contacts'
  }

  if (recipient.recipient_type === 'Brand') {
    return `All Agents (${recipient.brand.name.trim()})`
  }

  return ''
}

function getEmailDomain(email: string) {
  return email.split('@')[1]
}
