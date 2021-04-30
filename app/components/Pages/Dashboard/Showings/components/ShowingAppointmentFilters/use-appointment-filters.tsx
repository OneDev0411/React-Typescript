import { useMemo } from 'react'

import type { AppointmentFilter } from '../../types'
import { appointmentStatusInfo } from '../../hooks/use-appointment-filter-info'
import type { BookingFilterType } from './ShowingAppointmentFilterCard'
import { appointmentListInfo } from '../../hooks/use-appointment-list-info'

function useAppointmentFilters(
  filters: AppointmentFilter[],
  appointments: IShowingAppointment[],
  notifications: IShowingAppointment[]
): BookingFilterType[] {
  return useMemo<BookingFilterType[]>(
    () =>
      filters.map(filter => {
        const count =
          appointmentStatusInfo[filter].filter?.(appointments).length ??
          appointments.length
        const badge =
          appointmentStatusInfo[filter].filter?.(notifications).length ??
          notifications.length

        const hasNotifications = !!appointmentListInfo[filter]?.hasNotifications

        return {
          type: filter,
          ...appointmentStatusInfo[filter],
          count: hasNotifications ? count + badge : count,
          badge: hasNotifications ? badge : 0
        }
      }),
    [appointments, filters, notifications]
  )
}

export default useAppointmentFilters
