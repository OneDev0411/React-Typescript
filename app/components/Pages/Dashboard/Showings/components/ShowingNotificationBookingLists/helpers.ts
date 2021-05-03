import { appointmentListInfo } from '../../hooks/use-appointment-list-info'
import { AppointmentFilter } from '../../types'

const validFilters = Object.keys(appointmentListInfo)

export function getValidAppointmentFilter(
  filter: string | undefined,
  defaultFilter: AppointmentFilter = 'All'
): AppointmentFilter {
  return filter && validFilters.includes(filter)
    ? (filter as AppointmentFilter)
    : defaultFilter
}
