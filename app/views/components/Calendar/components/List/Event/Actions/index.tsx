import React from 'react'

import Button from '@material-ui/core/Button'

import { getActiveTeamId } from 'utils/user-teams'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

interface Props {
  event: ICalendarEvent
  user: IUser
}

export function EventActions({ event, user }: Props) {
  if (event.event_type === 'birthday' && !event.metadata.is_partner) {
    return (
      <SendContactCard
        contactId={event.contact}
        buttonStyle={{
          size: 'small'
        }}
      >
        Send Birthday Card
      </SendContactCard>
    )
  }

  if (event.event_type === 'Open House') {
    return (
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        href={`/openhouse/${event.id}/${getActiveTeamId(user)}/register`}
        target="_blank"
      >
        Registration Page
      </Button>
    )
  }

  return null
}
