import React, { useContext, useMemo, MouseEvent } from 'react'
import { makeStyles } from '@material-ui/styles'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { ListContext } from '../../context'

import { EventContainer } from '../components/EventContainer'
import { Associations } from './Associations'
import { CrmStatus } from './Status'
import { OpenHouseRegistration } from './actions/OpenHouseRegistration'

import { sharedStyles } from '../styles'

interface Props {
  event: ICalendarEvent
  user: IUser
  onEventChange(event: IEvent, type: string): void
}

const useStyles = makeStyles(sharedStyles)
export function CrmTask({ event, onEventChange }: Props) {
  const classes = useStyles({})
  const { setSelectedEvent } = useContext(ListContext)

  const handleSelectEvent = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setSelectedEvent(event)
  }

  const handleContainerClick = () => setSelectedEvent(event)

  const icon = useMemo(() => {
    if (eventIcons[event.event_type]) {
      return eventIcons[event.event_type]
    }

    if (event.event_type === 'Message') {
      return eventIcons.Mail
    }

    return eventIcons.Other
  }, [event.event_type])

  return (
    <EventContainer
      event={event}
      Icon={icon.icon}
      editable
      title={
        <div className={classes.title}>
          <a
            onClick={handleSelectEvent}
            style={{
              cursor: 'pointer'
            }}
          >
            {event.title ? (
              <TextMiddleTruncate text={event.title} maxLength={40} />
            ) : (
              `[No Title ${event.event_type}]`
            )}
          </a>
          <Associations event={event} onEventChange={onEventChange} />
        </div>
      }
      actions={
        <>
          <OpenHouseRegistration event={event} />
          <CrmStatus event={event} onChange={onEventChange} />
        </>
      }
      onClick={handleContainerClick}
    />
  )
}
