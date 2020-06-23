import _uniqBy from 'lodash/uniqBy'
import { EventInput } from '@fullcalendar/core'

import { getTitle } from './helpers/get-title'
import { getDates } from './helpers/get-dates'
import { isEditable } from './helpers/is-editable'
import { getStyles } from './helpers/get-styles'

/**
 * return list of events for using in full calendar
 * @param events
 */
export function normalizeEvents(events: ICalendarEvent[]): EventInput[] {
  const uniqEvents = _uniqBy(events, event =>
    event.object_type === 'crm_association' ? event.crm_task : event.id
  )

  return uniqEvents.map((event: ICalendarEvent) => {
    const { id, all_day } = event

    return {
      id,
      title: getTitle(event),
      allDay: all_day || false,
      editable: isEditable(event),
      rowEvent: event,
      ...getDates(event),
      ...getStyles(event)
    }
  })
}
