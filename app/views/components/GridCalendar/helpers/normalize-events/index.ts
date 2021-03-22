import _uniqBy from 'lodash/uniqBy'
import { EventInput } from '@fullcalendar/react'

import { getTitle } from './helpers/get-title'
import { getDates } from './helpers/get-dates'
import { isEditable } from './helpers/is-editable'

import { FilterShape } from '../../components/FilterEvents/type'
import {
  CRM_OBJECT_TYPES,
  CELEBRATION_OBJECT_TYPE,
  CELEBRATION_EVENT_TYPES,
  DEAL_OBJECT_TYPE,
  DEAL_EVENT_TYPES
} from '../../components/FilterEvents/helper'

/**
 * return list of events for using in full calendar
 * @param events
 */
export function normalizeEvents(
  events: ICalendarEvent[],
  filter: FilterShape
): EventInput[] {
  const uniqEvents: ICalendarEvent[] = _uniqBy(events, event =>
    event.object_type === 'crm_association' ? event.crm_task : event.id
  )

  const filteredEvents: ICalendarEvent[] = uniqEvents.filter(event => {
    const isUserEvent =
      filter.userEvents && CRM_OBJECT_TYPES.includes(event.object_type)

    const isCelebration =
      filter.celebrationEvents &&
      (event.object_type === CELEBRATION_OBJECT_TYPE ||
        event.object_type === DEAL_OBJECT_TYPE) &&
      CELEBRATION_EVENT_TYPES.includes(event.event_type)

    const isDeal =
      filter.dealEvents &&
      event.object_type === DEAL_OBJECT_TYPE &&
      DEAL_EVENT_TYPES.includes(event.event_type)

    if (isUserEvent || isCelebration || isDeal) {
      return true
    }

    return false
  })

  return filteredEvents.map((event: ICalendarEvent) => {
    const { id, all_day } = event

    return {
      id,
      title: getTitle(event),
      allDay: all_day || false,
      editable: isEditable(event),
      rowEvent: event,
      ...getDates(event)
    }
  })
}
