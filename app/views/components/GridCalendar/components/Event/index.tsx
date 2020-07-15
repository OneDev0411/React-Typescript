import React, { useState } from 'react'
import { EventContentArg } from '@fullcalendar/react'

import {
  isDealEvent,
  isCelebrationEvent
} from '../../helpers/normalize-events/helpers/event-checker'

import { GeneralEvent } from './components/General'
import { CelebrationEvent } from './components/Celebration'
import { DealEvent } from './components/Deal'
import { EventCard } from './components/Card'

export interface BaseEventProps {
  event: EventContentArg
  rowEvent: ICalendarEvent
  handleShowDetails: (e: React.MouseEvent<HTMLDivElement>) => void
  handleCloseDetails?: () => void
}

type EventsType = {
  component({
    event,
    rowEvent,
    handleShowDetails
  }: BaseEventProps): React.ReactElement<any> | null
  condition(event: EventContentArg, rowEvent: ICalendarEvent): boolean
}

const events: EventsType[] = [
  {
    component: CelebrationEvent,
    condition: (event: EventContentArg, rowEvent: ICalendarEvent) =>
      isCelebrationEvent(rowEvent)
  },
  {
    component: DealEvent,
    condition: (event: EventContentArg, rowEvent: ICalendarEvent) =>
      isDealEvent(rowEvent)
  },
  {
    component: GeneralEvent,
    condition: (event: EventContentArg, rowEvent: ICalendarEvent) =>
      ['crm_task', 'crm_association'].includes(rowEvent.object_type)
  }
]

export const Event = (props: Pick<BaseEventProps, 'event' | 'rowEvent'>) => {
  const { rowEvent } = props
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const handleShowDetails = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDetails = () => {
    setAnchorEl(null)
  }

  const eventItem = events.find(item => item.condition(props.event, rowEvent))

  if (!eventItem) {
    return null
  }

  return (
    <>
      <eventItem.component {...props} handleShowDetails={handleShowDetails} />
      <EventCard {...props} el={anchorEl} onClose={handleCloseDetails} />
    </>
  )
}
