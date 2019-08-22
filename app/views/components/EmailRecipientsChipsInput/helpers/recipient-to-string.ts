import { isContactList } from './is-contact-list'
import { isContactTag } from './is-contact-tag'

export function recipientToString(
  recipient: IDenormalizedEmailRecipientInput
): string {
  if (isContactList(recipient)) {
    return `${recipient.list.name} (List)`
  }

  if (isContactTag(recipient)) {
    return `${recipient.tag.text} (Tag)`
  }

  if (recipient.email) {
    if (!recipient.contact || !recipient.contact.display_name) {
      return recipient.email
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
      recipient.contact.display_name +
      (showEmail
        ? ` (${recipient.email
            .split('@')
            .slice(onlyShowDomain ? 1 : 0)
            .join('@')})`
        : '')
    )
  }

  return ''
}

function getEmailDomain(email: string) {
  return email.split('@')[1]
}
