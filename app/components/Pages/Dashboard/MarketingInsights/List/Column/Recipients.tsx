import React from 'react'
import { Box, Tooltip, Typography } from '@material-ui/core'

import { recipientsList } from '../helpers'

interface Props {
  data: IEmailCampaign
}

function RecipientsColumn({ data }: Props) {
  if (!Array.isArray(data)) {
    return null
  }

  const recipients = recipientsList(data)

  const tagsCount: number = recipients.tags.length || 0
  const listCount: number = recipients.list.length || 0
  const emailsCount: number = recipients.emails.length || 0
  const contactsCount: number = recipients.contacts.length || 0
  const recipientsCount: number = emailsCount + contactsCount

  const items: string[] = []

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
    // server puts the email on data even it sends to a contact
    // so maybe it confusing at some point that email isn't include the contact itself.
    const emailAddress = data[0].email

    return (
      <Tooltip title={emailAddress}>
        <Box pr={2} maxWidth="100%">
          <Typography noWrap>{emailAddress}</Typography>
        </Box>
      </Tooltip>
    )
  }

  return <span>{items.join(', ')}</span>
}

export default RecipientsColumn
