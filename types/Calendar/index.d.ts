declare type NumberRange = [number, number]

declare type ICalendarEventAssociations = 'full_thread'

declare type ICalendarEvent<
  Associations extends ICalendarEventAssociations = ''
> = {
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
  metadata: {
    status: string
    is_partner: boolean
  }
  next_occurence: string
  object_type: string
  recurring: boolean
  status: string
  end_date: string | null // TODO: communicated with Abbas
  timestamp: number
  timestamp_midday: string
  timestamp_readable: string
  title: string
  type: string
  type_label: string
  thread_key: string | null
  users: UUID[]
  people: (IContact | IAgent)[] | null
  people_len: number | null
  full_deal?: IDeal
} & Association<'full_thread', IEmailThread, Associations>

declare interface ICalendarEventHeader {
  date: string
  headerType: string
  isToday: boolean
  isEventHeader: boolean
  title: string
}

declare type ICalendarListRow = ICalendarEvent | ICalendarEventHeader

interface ICalendarEventsList {
  [key: string]: {
    ICalendarMonthEvents
  }
}

interface ICalendarMonthEvents {
  [key: string]: ICalendarEvent[] | []
}

interface IGoogleCalendarItem {
  id: string
  name: string
  description: string
  permission: string
  alreadySynced: boolean
}

interface IGoogleCalendars {
  calendars: IGoogleCalendarItem[]
  currentSelectedCal: {
    kind: string
    etag: string
    id: string
    summary: string
    description: string
    location: string
    timeZone: string
    colorId: number
    backgroundColor: string
    foregroundColor: string
    selected: boolean
    accessRole: string
    defaultReminders: unknown[]
    conferenceProperties: {
      allowedConferenceSolutionTypes: string[]
    }
  }
}
