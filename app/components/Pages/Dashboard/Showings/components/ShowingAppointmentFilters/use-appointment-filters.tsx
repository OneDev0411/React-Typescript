import { useMemo } from 'react'

import type { AppointmentFilter } from '../../types'
import { appointmentStatusInfo } from '../../hooks/use-appointment-filter-info'
import type { BookingFilterType } from './ShowingAppointmentFilterCard'

function useAppointmentFilters(
  filters: AppointmentFilter[],
  appointments: IShowingAppointment[]
): BookingFilterType[] {
  return useMemo<BookingFilterType[]>(
    () =>
      filters.map(filter => {
        const filteredAppointments =
          appointmentStatusInfo[filter].filter?.(appointments) ?? appointments

        const count = filteredAppointments.length
        const badge = filteredAppointments.filter(
          appointment => !!appointment.notifications?.length
        ).length

        return {
          type: filter,
          ...appointmentStatusInfo[filter],
          count,
          badge
        }
      }),
    [appointments, filters]
  )
}

export default useAppointmentFilters
