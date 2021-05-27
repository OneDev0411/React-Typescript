import { useMemo } from 'react'

import { sortAppointments } from '../../helpers'

function useSortAppointments(
  appointments: IShowingAppointment[]
): IShowingAppointment[] {
  return useMemo(() => sortAppointments(appointments), [appointments])
}

export default useSortAppointments
