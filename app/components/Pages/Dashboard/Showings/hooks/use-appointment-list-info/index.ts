import { AppointmentFilter } from '../../types'

interface UseAppointmentListInfoReturn {
  emptyMessage: string
}

export const appointmentListInfo: Partial<
  Record<AppointmentFilter, UseAppointmentListInfoReturn>
> = {
  All: {
    emptyMessage: 'There are no bookings.'
  },
  Requested: {
    emptyMessage: 'There are no requests.'
  },
  Confirmed: {
    emptyMessage: 'There are no bookings.'
  },
  Rescheduled: {
    emptyMessage: 'There are no bookings.'
  },
  Canceled: {
    emptyMessage: 'There are no cancellations.'
  },
  Feedback: {
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
