declare type NumberRange = [number, number]

interface FullCrmTaskAssociations {
  id: string
  association_type: 'contact' | 'deal' | 'listing'
  brand: string
  contact?: IContact
  deal?: IDeal
  listing?: any
  created_at: string
  created_by: string
  crm_task: string
  deleted_at: string | null
  index: number | null
  metadata: any
  type: string
  updated_at: number
}

declare interface CalendarEvent {
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
    associations: FullCrmTaskAssociations[]
  }
}

interface CalendarEventsList {
  [key: string]: CalendarEvent[] | []
}
