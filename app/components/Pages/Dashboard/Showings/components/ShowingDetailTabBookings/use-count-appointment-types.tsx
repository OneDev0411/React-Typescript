import { useMemo } from 'react'

function useCountAppointmentTypes(
  appointments: IShowingAppointment[]
): Record<IAppointmentStatus, number> {
  return useMemo(() => {
    const counters: Record<IAppointmentStatus, number> = {
      Canceled: 0,
      Completed: 0,
      Confirmed: 0,
      Requested: 0,
      Rescheduled: 0
    }

    appointments.forEach(appointment => {
      counters[appointment.status]++
    })

    return counters
  }, [appointments])
}

export default useCountAppointmentTypes
