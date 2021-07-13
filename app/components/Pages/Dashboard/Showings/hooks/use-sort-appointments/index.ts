import { useMemo } from 'react'

import { sortAppointments } from '../../helpers'

function useSortAppointments(
  appointments: IShowingAppointment<'showing'>[]
): IShowingAppointment<'showing'>[] {
  return useMemo(() => sortAppointments(appointments), [appointments])
}

export default useSortAppointments
