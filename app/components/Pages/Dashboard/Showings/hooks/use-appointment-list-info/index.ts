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
    notificationsEmptyMessage: 'There are no new alerts.',
    hasBookings: true,
    bookingsTitle: 'All Bookings',
    bookingsEmptyMessage: 'There are no bookings.'
  },
  Requested: {
    hasNotifications: true,
    notificationsTitle: 'New Requests',
    notificationsEmptyMessage: 'There are no new requests.',
    hasBookings: false,
    bookingsTitle: 'All Requests',
    bookingsEmptyMessage: 'There are no requests.'
  },
  Confirmed: {
    hasNotifications: true,
    notificationsTitle: 'New Approved',
    notificationsEmptyMessage: 'There are no new bookings.',
    hasBookings: true,
    bookingsTitle: 'All Approved',
    bookingsEmptyMessage: 'There are no bookings.'
  },
  Rescheduled: {
    hasNotifications: true,
    notificationsTitle: 'New Requests',
    notificationsEmptyMessage: 'There are no new requests.',
    hasBookings: true,
    bookingsTitle: 'All Rescheduled',
    bookingsEmptyMessage: 'There are no bookings.'
  },
  Canceled: {
    hasNotifications: true,
    notificationsTitle: 'New Cancellation',
    notificationsEmptyMessage: 'There are no new cancellations.',
    hasBookings: true,
    bookingsTitle: 'Canceled',
    bookingsEmptyMessage: 'There are no cancellations.'
  },
  Feedback: {
    hasNotifications: true,
    notificationsTitle: 'New Feedback',
    notificationsEmptyMessage: 'There are no new feedbacks.',
    hasBookings: true,
    bookingsTitle: 'Feedback',
    bookingsEmptyMessage: 'There are no feedbacks.'
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
