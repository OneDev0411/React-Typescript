declare type NumberRange = [number, number]

declare interface ICalendarEvent {
  id: UUID
  timestamp: number
  recurring: boolean
  title: string
  timestamp: number
  object_type: string
  campaign: UUID | null
  contact: UUID | null
  created_by: string
  crm_task: UUID
  date: string
  deal: UUID | null
  event_type: string
  metadata: { status: string }
  next_occurence: string
  object_type: string
  recurring: boolean
  status: string
  timestamp: number
  timestamp_midday: string
  timestamp_readable: string
  title: string
  type: string
  type_label: string
  users: UUID[]
  full_contact?: IContact
  full_deal?: IDeal
  full_crm_task?: {
    assignees: IUser[]
    associations: TaskAssociations[]
  }
}

declare interface ICalendarDayRow {
  is_day_header: boolean
  is_today: boolean
  date: Date
}

declare type ICalendarListRow = ICalendarEvent | ICalendarDayRow

interface CalendarEventsList {
  [key: string]: ICalendarEvent[] | []
}
