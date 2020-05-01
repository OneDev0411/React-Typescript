import { EmailStatType, ContactsListType } from './types'

export function getContactStat(email: IEmailCampaignEmail): EmailStatType {
  return {
    unsubscribed: email.unsubscribed,
    failed: email.failed,
    opened: email.opened,
    clicked: email.clicked
  }
}

export function contactsList(
  item: IEmailCampaign<IEmailCampaignAssociation>
): ContactsListType[] {
  const emails = item.emails

  if (!Array.isArray(emails)) {
    return []
  }

  return emails.map(email => ({
    // This is using for mini contact
    original_data: email,
    id: email.id,
    display_name: email.full_name,
    profile_image_url: email.profile_image_url,
    to: email.email_address,
    contact: email.contact,
    ...getContactStat(email)
  }))
}
