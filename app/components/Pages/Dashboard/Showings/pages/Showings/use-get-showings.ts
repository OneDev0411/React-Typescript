import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

import getShowings from 'models/showing/get-showings'
import useAsync from 'hooks/use-async'

import useSortAppointments from '../../hooks/use-sort-appointments'
import useShowingsUpdateAppointmentNotifications from './use-showings-update-appointment-notifications'

interface UseGetShowingsReturn {
  isLoading: boolean
  showings: IShowing[]
  appointments: IShowingAppointment[]
  setShowings: Dispatch<SetStateAction<IShowing[]>>
}

function useGetShowings(): UseGetShowingsReturn {
  const { data: rows, isLoading, run, setData } = useAsync<IShowing[]>({
    data: []
  })

  useEffect(() => {
    run(getShowings)
  }, [run])

  const appointments = useMemo(
    () =>
      rows.reduce<IShowingAppointment[]>(
        (acc, showing) =>
          showing.appointments
            ? acc.concat(
                showing.appointments.map(appointment => ({
                  ...appointment,
                  showing: {
                    ...showing,
                    appointments: null
                  }
                }))
              )
            : acc,
        []
      ),
    [rows]
  )

  const sortedAppointments = useSortAppointments(appointments)

  useShowingsUpdateAppointmentNotifications(setData)

  return {
    isLoading,
    showings: rows,
    appointments: sortedAppointments,
    setShowings: setData
  }
}

export default useGetShowings
