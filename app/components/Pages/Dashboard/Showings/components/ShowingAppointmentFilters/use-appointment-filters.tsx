import { useMemo } from 'react'

import type { AppointmentFilter } from '../../types'
import { appointmentStatusInfo } from '../../hooks/use-appointment-filter-info'
import type { BookingFilterType } from './ShowingAppointmentFilterCard'

function useAppointmentFilters(
  filters: AppointmentFilter[],
  appointments: IShowingAppointment[],
  notifications: IShowingAppointment[]
): BookingFilterType[] {
  return useMemo<BookingFilterType[]>(
    () =>
      filters.map(filter => ({
        type: filter,
        ...appointmentStatusInfo[filter],
        count:
          appointmentStatusInfo[filter].filter?.(appointments).length ??
          appointments.length,
        badge:
          appointmentStatusInfo[filter].filter?.(notifications).length ??
          notifications.length
      })),
    [appointments, filters, notifications]
  )
}

export default useAppointmentFilters
