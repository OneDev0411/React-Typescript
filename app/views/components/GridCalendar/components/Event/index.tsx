import React, { useState } from 'react'
import { EventContentArg } from '@fullcalendar/react'

import { CrmEventType } from 'components/Calendar/types'

import {
  isDealEvent,
  isCelebrationEvent
} from '../../helpers/normalize-events/helpers/event-checker'

import { GeneralEvent } from './components/General'
import { CelebrationEvent } from './components/Celebration'
import { DealEvent } from './components/Deal'
import { EventCard } from './components/Card'
import { CRM_OBJECT_TYPES } from '../FilterEvents/helper'

export interface BaseEventProps {
  event: EventContentArg
  rowEvent: ICalendarEvent
  handleShowDetails: (e: React.MouseEvent<HTMLDivElement>) => void
  handleCloseDetails?: () => void
}

interface Props extends Pick<BaseEventProps, 'event' | 'rowEvent'> {
  onSelect(event: ICalendarEvent | null): void
  onChange(event: IEvent, type: CrmEventType): void
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
      CRM_OBJECT_TYPES.includes(rowEvent.object_type)
  }
]

export const Event = (props: Props) => {
  const { rowEvent, onSelect, onChange } = props
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
      <EventCard
        {...props}
        el={anchorEl}
        onSelect={onSelect}
        onChange={onChange}
        onClose={handleCloseDetails}
      />
    </>
  )
}
