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
  people: IContact[] | null
  people_len: number | null
  full_deal?: IDeal
  full_thread: {
    type: 'thread'
    id: UUID
    to: string[]
    email_count: number
    has_attachments: boolean
  } | null // // TODO: fix association type
}

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
