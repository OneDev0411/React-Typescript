import { useMemo } from 'react'

import { AppointmentFilterInfo } from '../../types'

function useFilterAppointment(
  appointments: IShowingAppointment[],
  filterInfo: AppointmentFilterInfo
): IShowingAppointment[] {
  return useMemo(
    () => (filterInfo.filter ? filterInfo.filter(appointments) : appointments),
    [filterInfo, appointments]
  )
}

export default useFilterAppointment
