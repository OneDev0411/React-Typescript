export const normalizeRecipients = recipients =>
  recipients.map(recipient => {
    if (recipient.data_type === 'contact') {
      return {
        contact: recipient.contactId,
        email: recipient.email
      }
    }

    if (recipient.data_type === 'email') {
      return {
        email: recipient.email
      }
    }

    if (recipient.data_type === 'tag') {
      return {
        tag: recipient.text
      }
    }

    return {
      [recipient.data_type]: recipient.id
    }
  })
