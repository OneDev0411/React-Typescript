import React from 'react'
import { EventContentArg } from '@fullcalendar/react'

import {
  isDealEvent,
  isCelebrationEvent
} from '../../helpers/normalize-events/helpers/event-checker'

import { GeneralEvent } from './General'
import { CelebrationEvent } from './Celebration'
import { DealEvent } from './Deal'

export interface BaseEventProps {
  event: EventContentArg
  rowEvent: ICalendarEvent
}

type EventsType = {
  component({ event, rowEvent }: BaseEventProps): React.ReactElement<any> | null
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

export const Event = (props: BaseEventProps) => {
  const eventItem = events.find(item =>
    item.condition(props.event, props.rowEvent)
  )

  if (!eventItem) {
    return null
  }

  return <eventItem.component {...props} />
}
