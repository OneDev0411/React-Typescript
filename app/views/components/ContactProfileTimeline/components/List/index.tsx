import { useState } from 'react'

import { CrmEventType } from 'components/ContactProfileTimeline/types'

import { ListContext } from './context'
import { EventController } from './EventController'
import { EventLoader } from './EventLoader'

interface Props {
  user: IUser
  contact: IContact | undefined
  rows: ICalendarListRow[]
  isLoading: boolean
  isReachedStart: boolean
  isReachedEnd: boolean
  onLoadNextEvents: () => void
  onLoadPreviousEvents: () => void
  onCrmEventChange: (event: IEvent, type: CrmEventType) => void
  onScheduledEmailChange: (
    event: ICalendarEvent,
    emailCampaign: IEmailCampaign
  ) => void
  eventType?: 'upcoming' | 'history'
}

export function CalendarList({
  user,
  contact,
  rows,
  isLoading,
  isReachedEnd,
  isReachedStart,
  onLoadNextEvents,
  onLoadPreviousEvents,
  onCrmEventChange,
  onScheduledEmailChange,
  eventType
}: Props) {
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null
  )

  /**
   * triggers when an event updates or deletes
   * @param event - the event
   * @param type - type of action
   */
  const handleEventChange = (event: IEvent, type: CrmEventType) => {
    onCrmEventChange(event, type)
    setSelectedEvent(null)
  }

  /**
   * triggers when an email campaign updates
   * @param event - the event
   * @param emailCampaign - the updated email camapign
   */
  const handleScheduledEmailChange = (emailCampaign: IEmailCampaign) => {
    onScheduledEmailChange(selectedEvent as ICalendarEvent, emailCampaign)
    setSelectedEvent(null)
  }

  return (
    <ListContext.Provider
      value={{
        selectedEvent,
        contact,
        setSelectedEvent
      }}
    >
      <EventLoader
        rows={rows}
        isLoading={isLoading}
        isReachedEnd={isReachedEnd}
        isReachedStart={isReachedStart}
        onLoadPreviousEvents={onLoadPreviousEvents}
        onLoadNextEvents={onLoadNextEvents}
        handleEventChange={handleEventChange}
        eventType={eventType}
      />

      <EventController
        user={user}
        onEventChange={handleEventChange}
        onScheduledEmailChange={handleScheduledEmailChange}
      />
    </ListContext.Provider>
  )
}
