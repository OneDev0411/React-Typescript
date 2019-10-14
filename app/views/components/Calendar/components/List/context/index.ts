import { createContext } from 'react'

interface Context {
  selectedEvent: ICalendarEvent | null
  setSelectedEvent(event: ICalendarEvent | null): void
}

export const ListContext = createContext<Context>({
  selectedEvent: null,
  setSelectedEvent: () => null
})
