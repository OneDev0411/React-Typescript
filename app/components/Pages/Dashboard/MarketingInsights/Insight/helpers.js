export function getContactStat(email) {
  return {
    unsubscribed: email.unsubscribed,
    failed: email.failed,
    opened: email.opened,
    clicked: email.clicked
  }
}

export function contactsList(item) {
  const emails = item.emails

  if (!Array.isArray(emails)) {
    return []
  }

  return emails.map(email => ({
    id: email.id,
    display_name: email.display_name,
    profile_image_url: email.profile_image_url,
    to: email.email_address,
    ...getContactStat(email)
  }))
}
