import { useMemo } from 'react'

import { AppointmentFilterInfo } from '../../types'

function useFilterAppointment(
  appointments: IShowingAppointment<'showing'>[],
  filterInfo: AppointmentFilterInfo
): IShowingAppointment<'showing'>[] {
  return useMemo(
    () => (filterInfo.filter ? filterInfo.filter(appointments) : appointments),
    [filterInfo, appointments]
  )
}

export default useFilterAppointment
