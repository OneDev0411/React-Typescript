import type { SelectItem } from 'components/Select'

import type { ShowingDetailTabType, ShowingsTabType } from './types'

export const showingDetailTabs: Record<
  ShowingDetailTabType,
  ShowingDetailTabType
> = {
  Bookings: 'Bookings',
  Visitors: 'Visitors',
  Feedback: 'Feedback',
  Settings: 'Settings'
}

export const showingAppointmentStatuses: Record<
  IShowingAppointmentStatus,
  IShowingAppointmentStatus
> = {
  Requested: 'Requested',
  Confirmed: 'Confirmed',
  Rescheduled: 'Rescheduled',
  Canceled: 'Canceled',
  Completed: 'Completed'
}

export const showingsTabs: Record<ShowingsTabType, ShowingsTabType> = {
  Properties: 'Properties',
  Bookings: 'Bookings'
}

export const showingDurationOptions: SelectItem<number>[] = [
  { label: '15 minutes', value: 15 * 60 },
  { label: '30 minutes', value: 30 * 60 },
  { label: '1 hour', value: 60 * 60 }
]
