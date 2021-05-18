import { useMemo } from 'react'

type UseShowingCountVisitorCountReturn = Record<UUID, number>

function useShowingCountVisitorCount(
  appointments: IShowingAppointment[]
): UseShowingCountVisitorCountReturn {
  return useMemo(
    () =>
      appointments.reduce<UseShowingCountVisitorCountReturn>(
        (acc, value) => ({
          ...acc,
          [value.contact.id]: acc[value.contact.id]
            ? acc[value.contact.id] + 1
            : 1
        }),
        {}
      ),
    [appointments]
  )
}

export default useShowingCountVisitorCount
