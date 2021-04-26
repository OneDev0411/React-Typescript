import { useMemo } from 'react'

import { AppointmentFilter } from './types'

function useCountAppointmentTypes(
  appointments: IShowingAppointment[]
): Record<AppointmentFilter, number> {
  return useMemo(() => {
    const counters: Record<AppointmentFilter, number> = {
      All: 0,
      Canceled: 0,
      Completed: 0,
      Confirmed: 0,
      Requested: 0,
      Rescheduled: 0,
      Feedback: 0
    }

    appointments.forEach(appointment => {
      counters[appointment.status]++
    })

    counters.All = appointments.length

    return counters
  }, [appointments])
}

export default useCountAppointmentTypes
