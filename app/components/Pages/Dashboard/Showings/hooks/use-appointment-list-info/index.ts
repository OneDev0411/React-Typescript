import { AppointmentFilter } from '../../types'

interface UseAppointmentListInfoReturn {
  title: string
  emptyMessage: string
}

export const appointmentListInfo: Partial<
  Record<AppointmentFilter, UseAppointmentListInfoReturn>
> = {
  All: {
    title: 'All Bookings',
    emptyMessage: 'There are no bookings.'
  },
  Requested: {
    title: 'All Requests',
    emptyMessage: 'There are no requests.'
  },
  Confirmed: {
    title: 'All Approved',
    emptyMessage: 'There are no bookings.'
  },
  Rescheduled: {
    title: 'All Rescheduled',
    emptyMessage: 'There are no bookings.'
  },
  Canceled: {
    title: 'Canceled',
    emptyMessage: 'There are no cancellations.'
  },
  Feedback: {
    title: 'Feedback',
    emptyMessage: 'There are no feedbacks.'
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
