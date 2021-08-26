import { createContext } from 'react'

interface Context {
  contact: IContact | undefined
  selectedEvent: ICalendarEvent | null
  setSelectedEvent(event: ICalendarEvent | null): void
}

export const ListContext = createContext<Context>({
  contact: undefined,
  selectedEvent: null,
  setSelectedEvent: () => null
})
