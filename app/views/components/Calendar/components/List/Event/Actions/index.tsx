import React, { useContext } from 'react'

import Button from '@material-ui/core/Button'

import { getActiveTeamId } from 'utils/user-teams'

// import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import { ListContext } from '../../context'

interface Props {
  event: ICalendarEvent
  user: IUser
}

export function EventActions({ event, user }: Props) {
  const { actions } = useContext(ListContext)

  const handleClickAction = () => {
    actions.emit('event-action', { event })
  }

  if (event.event_type === 'birthday' && !event.metadata.is_partner) {
    return (
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={handleClickAction}
      >
        Send Birthday Card
      </Button>
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
        Guest Registration Page
      </Button>
    )
  }

  return null
}
