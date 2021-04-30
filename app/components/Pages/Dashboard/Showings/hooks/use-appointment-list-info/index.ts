import { AppointmentFilter } from '../../types'

interface UseAppointmentListInfoReturn {
  hasNotifications: boolean
  notificationsTitle?: string
  notificationsEmptyMessage?: string
  hasBookings: boolean
  bookingsTitle?: string
  bookingsEmptyMessage?: string
}

export const appointmentListInfo: Partial<
  Record<AppointmentFilter, UseAppointmentListInfoReturn>
> = {
  All: {
    hasNotifications: true,
    notificationsTitle: 'New Alerts',
    notificationsEmptyMessage: 'There is no new alert.',
    hasBookings: true,
    bookingsTitle: 'All Bookings',
    bookingsEmptyMessage: 'There is no booking.'
  },
  Requested: {
    hasNotifications: true,
    notificationsTitle: 'New Requests',
    notificationsEmptyMessage: 'There is no new request.',
    hasBookings: true,
    bookingsTitle: 'All Requests',
    bookingsEmptyMessage: 'There is no request.'
  },
  Confirmed: {
    hasNotifications: false,
    hasBookings: true,
    bookingsTitle: 'Approved',
    bookingsEmptyMessage: 'There is no booking.'
  },
  Rescheduled: {
    hasNotifications: true,
    notificationsTitle: 'New Requests',
    notificationsEmptyMessage: 'There is no new request.',
    hasBookings: false
  },
  Canceled: {
    hasNotifications: true,
    notificationsTitle: 'New Cancellation',
    notificationsEmptyMessage: 'There is no new cancellation.',
    hasBookings: true,
    bookingsTitle: 'Canceled',
    bookingsEmptyMessage: 'There is no cancellation.'
  },
  Feedback: {
    hasNotifications: true,
    notificationsTitle: 'New Feedback',
    notificationsEmptyMessage: 'There is no new feedback.',
    hasBookings: true,
    bookingsTitle: 'Feedback',
    bookingsEmptyMessage: 'There is no feedback.'
  }
}

function useAppointmentListInfo(
  filter: AppointmentFilter
): UseAppointmentListInfoReturn {
  const record = appointmentListInfo[filter]

  if (!record) {
    throw new Error('Invalid filter value')
  }

  return record
}

export default useAppointmentListInfo
