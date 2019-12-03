import { FilterQuery } from 'models/calendar/get-calendar'

export interface CalendarRef {
  jumpToDate(date: Date): void
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

export enum Placeholder {
  Day = 1,
  Month = 2
}

export enum LoadingDirection {
  Top = 1,
  Bottom = 2
}

export type CrmEventType = 'created' | 'deleted' | 'updated'
