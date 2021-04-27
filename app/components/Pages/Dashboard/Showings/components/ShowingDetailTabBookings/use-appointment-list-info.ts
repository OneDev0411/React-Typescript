import { AppointmentFilter } from './types'

interface UseAppointmentListInfoReturn {
  hasNotifications: boolean
  notificationsTitle?: string
  hasBookings: boolean
  bookingsTitle?: string
}

function useAppointmentListInfo(
  filter: AppointmentFilter
): UseAppointmentListInfoReturn {
  switch (filter) {
    case 'All':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Alerts',
        hasBookings: true,
        bookingsTitle: 'All Bookings'
      }
    case 'Requested':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Requests',
        hasBookings: true,
        bookingsTitle: 'All Requests'
      }
    case 'Confirmed':
      return {
        hasNotifications: false,
        hasBookings: true
      }
    case 'Rescheduled':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Requests',
        hasBookings: false
      }
    case 'Canceled':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Cancellation',
        hasBookings: true,
        bookingsTitle: 'Canceled'
      }
    case 'Feedback':
      return {
        hasNotifications: true,
        notificationsTitle: 'New Feedback',
        hasBookings: true,
        bookingsTitle: 'Feedback'
      }
    default:
      throw new Error('Invalid filter value')
  }
}

export default useAppointmentListInfo
