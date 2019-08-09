import { FilterQuery } from './models/get-calendar'

export interface CalendarRef {
  jumpToDate(date: Date): void
  refresh(date: Date): void
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
}
