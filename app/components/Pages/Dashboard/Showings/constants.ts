import type { ShowingDetailTabType } from './types'

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
  Pending: 'Pending',
  Approved: 'Approved',
  NeedsRescheduling: 'NeedsRescheduling',
  Rescheduled: 'Rescheduled',
  Cancelled: 'Cancelled',
  Finished: 'Finished'
}
