import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

import getShowings from 'models/showing/get-showings'
import useAsync from 'hooks/use-async'

import useSortAppointments from '../../hooks/use-sort-appointments'
import useShowingsUpdateAppointmentNotifications from './use-showings-update-appointment-notifications'

interface UseGetShowingsReturn {
  isLoading: boolean
  showings: IShowing<'showing'>[]
  appointments: IShowingAppointment<'showing'>[]
  setShowings: Dispatch<SetStateAction<IShowing<'showing'>[]>>
}

function useGetShowings(): UseGetShowingsReturn {
  const { data: rows, isLoading, run, setData } = useAsync<
    IShowing<'showing'>[]
  >({
    data: [],
    status: 'pending'
  })

  useEffect(() => {
    run(async () => {
      const showings = await getShowings()

      return showings.map(showing => ({
        ...showing,
        appointments: showing.appointments
          ? showing.appointments.map(appointment => ({
              ...appointment,
              showing: {
                ...showing,
                appointments: null
              }
            }))
          : null
      }))
    })
  }, [run])

  const appointments = useMemo(
    () =>
      rows.reduce<IShowingAppointment<'showing'>[]>(
        (acc, showing) =>
          showing.appointments ? [...acc, ...showing.appointments] : acc,
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
