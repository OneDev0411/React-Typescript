declare type NumberRange = [number, number]

declare interface CalendarEvent {
  id: UUID
  timestamp: number
  recurring: boolean
  title: string
  timestamp: number
  object_type: string
}

interface CalendarEventsList {
  [key: string]: CalendarEvent[] | []
}
