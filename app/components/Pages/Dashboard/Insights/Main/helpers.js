export function percent(num, allNum) {
  if (num === 0 || allNum === 0) {
    return 0
  }

  return num / allNum
}

export function recipientsList(recipients) {
  const list = []
  const tags = []
  const contacts = []
  const emails = []

  recipients.forEach(recipient => {
    if (recipient.tag) {
      tags.push(recipient.tag)
    } else if (recipient.list) {
      list.push(recipient.list)
    } else if (recipient.contact) {
      contacts.push(recipient.contact)
    } else {
      emails.push(recipient.email)
    }
  })

  return {
    list,
    tags,
    contacts,
    emails
  }
}

export function show_title(title) {
  return title.trim() || 'No Title'
}
