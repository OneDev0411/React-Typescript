import { EventEmitter } from 'events'

import { createContext } from 'react'

interface Context {
  selectedEvent: ICalendarEvent | null
  actionsEmitter: EventEmitter
  setSelectedEvent(event: ICalendarEvent | null): void
}

export const ListContext = createContext<Context>({
  selectedEvent: null,
  actionsEmitter: null,
  setSelectedEvent: () => null
})
