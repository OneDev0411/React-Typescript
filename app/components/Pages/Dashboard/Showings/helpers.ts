import { showingsTabs } from './constants'
import { AppointmentFilter } from './types'

export function hourToSeconds(hour: number) {
  return hour * 60 * 60
}

export const generateAppointmentFilterLink = (filter: AppointmentFilter) =>
  `/dashboard/showings/${showingsTabs.Bookings}?filter=${filter}`
