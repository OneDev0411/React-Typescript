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
  IAppointmentStatus,
  IAppointmentStatus
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
