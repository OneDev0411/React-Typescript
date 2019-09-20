import { EventEmitter } from 'events'

import { createContext } from 'react'

interface Context {
  selectedEvent: ICalendarEvent | null
  actions: EventEmitter
  setSelectedEvent(event: ICalendarEvent | null): void
}

export const ListContext = createContext<Context>({
  selectedEvent: null,
  actions: new EventEmitter(),
  setSelectedEvent: () => null
})
