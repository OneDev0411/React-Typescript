import React from 'react'

import { CrmEvents } from '../../../Calendar/components/CrmEvents'

interface Props {
  user: IUser
  event: ICalendarEvent | null
  onEventChange(event: IEvent, type: string): void
  setSelectedEvent(event: ICalendarEvent | null): void
}

export const EventController = ({
  user,
  event,
  setSelectedEvent,
  onEventChange
}: Props) => {
  const eventDrawer =
    event && ['crm_task', 'crm_association'].includes(event.object_type) ? (
      <CrmEvents
        isEventDrawerOpen
        event={event}
        user={user}
        onEventChange={onEventChange}
        onCloseEventDrawer={() => setSelectedEvent(null)}
      />
    ) : null

  return <>{eventDrawer}</>
}
