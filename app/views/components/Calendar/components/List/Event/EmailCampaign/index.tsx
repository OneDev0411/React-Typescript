import React, { useContext } from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { ListContext } from '../../context'

import { EventContainer } from '../components/EventContainer'

import { sharedStyles } from '../styles'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
}

const useSharedStyles = makeStyles(sharedStyles)
const useStyles = makeStyles(
  (theme: Theme) => ({
    sending: {
      opacity: 0.4
    }
  }),
  { name: 'EmailCampaign' }
)

export function EmailCampaign({ style, event }: Props) {
  const { setSelectedEvent } = useContext(ListContext)
  const handleContainerClick = () => setSelectedEvent(event)

  const classes = useStyles()
  const sharedClasses = useSharedStyles({})

  const sending =
    event.event_type === 'scheduled_email' &&
    event.timestamp * 1000 < Date.now()

  return (
    <EventContainer
      style={style}
      classes={{ root: sending ? classes.sending : '' }}
      event={event}
      Icon={eventIcons.Email.icon}
      editable={false}
      title={
        <div>
          <a
            className={sharedClasses.link}
            onClick={e => {
              e.preventDefault()
              setSelectedEvent(event)
            }}
          >
            {event.title || 'No Subject'}
            {sending && ' (sending ...)'}
          </a>
        </div>
      }
      onClick={handleContainerClick}
    />
  )
}
