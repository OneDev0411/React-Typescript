import { AppointmentFilter } from '../../types'

interface UseAppointmentListInfoReturn {
  hasNotifications: boolean
  notificationsTitle?: string
  notificationsEmptyMessage?: string
  hasBookings: boolean
  bookingsTitle?: string
  bookingsEmptyMessage?: string
}

function useAppointmentListInfo(
  filter: AppointmentFilter
): UseAppointmentListInfoReturn {
  switch (filter) {
    case 'All':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Alerts',
        notificationsEmptyMessage: 'There is no new alert.',
        hasBookings: true,
        bookingsTitle: 'All Bookings',
        bookingsEmptyMessage: 'There is no booking.'
      }
    case 'Requested':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Requests',
        notificationsEmptyMessage: 'There is no new request.',
        hasBookings: true,
        bookingsTitle: 'All Requests',
        bookingsEmptyMessage: 'There is no request.'
      }
    case 'Confirmed':
      return {
        hasNotifications: false,
        hasBookings: true,
        bookingsTitle: 'Approved',
        bookingsEmptyMessage: 'There is no booking.'
      }
    case 'Rescheduled':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Requests',
        notificationsEmptyMessage: 'There is no new request.',
        hasBookings: false
      }
    case 'Canceled':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Cancellation',
        notificationsEmptyMessage: 'There is no new cancellation.',
        hasBookings: true,
        bookingsTitle: 'Canceled',
        bookingsEmptyMessage: 'There is no cancellation.'
      }
    case 'Feedback':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Feedback',
        notificationsEmptyMessage: 'There is no new feedback.',
        hasBookings: true,
        bookingsTitle: 'Feedback',
        bookingsEmptyMessage: 'There is no feedback.'
      }
    default:
      throw new Error('Invalid filter value')
  }
}

export default useAppointmentListInfo
