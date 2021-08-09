import { FilterQuery } from 'models/calendar/get-calendar'

export interface CalendarRef {
  refresh(date: Date, range: NumberRange | null): void
  updateCrmEvents(event: IEvent, type: string): void
}

export interface ApiOptions {
  range: NumberRange
  filter?: FilterQuery
  associations?: string[]
  users?: UUID[]
}

export interface FetchOptions {
  reset?: boolean
  calendarRange?: NumberRange
}

export type CrmEventType = 'created' | 'deleted' | 'updated'
