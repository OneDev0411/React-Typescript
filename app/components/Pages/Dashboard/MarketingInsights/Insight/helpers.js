export function getEmail(email) {
  try {
    return email.email.to[0]
  } catch (e) {
    return ''
  }
}

export function getContactStat(email) {
  // mutable const :)))
  const output = {
    unsubscribed: 0,
    failed: 0,
    opened: 0,
    clicked: 0
  }
  const sentEmail = email.email

  if (!sentEmail) {
    return output
  }

  output.unsubscribed = sentEmail.unsubscribed
  output.failed = sentEmail.failed
  output.opened = sentEmail.opened
  output.clicked = sentEmail.clicked

  return output
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
    to: getEmail(email),
    ...getContactStat(email)
  }))
}
