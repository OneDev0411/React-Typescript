import { useMemo } from 'react'

function useSortAppointments(
  appointments: IShowingAppointment[]
): IShowingAppointment[] {
  return useMemo(
    () =>
      [...appointments].sort((a, b) => {
        const time1 = new Date(a.time)
        const time2 = new Date(b.time)

        if (time1 < time2) {
          return -1
        }

        if (time1 > time2) {
          return 1
        }

        return 0
      }),
    [appointments]
  )
}

export default useSortAppointments
