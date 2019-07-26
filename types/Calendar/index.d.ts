declare type NumberRange = [number, number]

declare interface CalendarEvent {
  id: UUID
  timestamp: number
  recurring: boolean
  title: string
}

interface CalendarEventsList {
  [key: string]: CalendarEvent[] | []
}
