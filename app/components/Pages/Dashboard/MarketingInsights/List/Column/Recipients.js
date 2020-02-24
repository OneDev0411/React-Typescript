import React from 'react'

import { recipientsList } from '../helpers'

function RecipientsColumn(props) {
  if (!Array.isArray(props.data)) {
    return null
  }

  const recipients = recipientsList(props.data)

  const tagsCount = recipients.tags.length || 0
  const listCount = recipients.list.length || 0
  const emailsCount = recipients.emails.length || 0
  const contactsCount = recipients.contacts.length || 0
  const recipientsCount = emailsCount + contactsCount

  const items = []

  if (recipientsCount) {
    items.push(`${recipientsCount} Recipients`)
  }

  if (listCount) {
    items.push(`${listCount} List`)
  }

  if (tagsCount) {
    items.push(`${tagsCount} Tags`)
  }

  if (recipientsCount === 1 && listCount === 0 && tagsCount === 0) {
    // server puts the email on props.data even it sends to a contact
    // so maybe it confusing at some point that email isn't include the contact itself.
    const emailAddress = props.data[0].email

    return <span>{emailAddress}</span>
  }

  return <span>{items.join(', ')}</span>
}

export default RecipientsColumn
