import React from 'react'

import { Box, Tooltip, Typography } from '@material-ui/core'
import pluralize from 'pluralize'

import { recipientsList } from '../helpers'

interface Props {
  data: IEmailCampaign<'recipients'>
}

function RecipientsColumn({ data }: Props) {
  if (data.executed_at) {
    return pluralize('Recipient', data.sent, true)
  }

  if (!Array.isArray(data.recipients)) {
    return null
  }

  const recipients = recipientsList(data.recipients)

  const tagsCount: number = recipients.tags.length || 0
  const listCount: number = recipients.list.length || 0
  const emailsCount: number = recipients.emails.length || 0
  const contactsCount: number = recipients.contacts.length || 0
  const recipientsCount: number = emailsCount + contactsCount

  const items: string[] = []

  if (recipientsCount) {
    items.push(pluralize('Recipient', recipientsCount, true))
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
    const emailAddress = data.recipients[0].email || 'No Email'

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
