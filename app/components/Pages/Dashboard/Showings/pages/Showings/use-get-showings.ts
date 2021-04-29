import { useEffect, useMemo } from 'react'

import getShowings from 'models/showing/get-showings'
import useAsync from 'hooks/use-async'

import useSortAppointments from '../../components/use-sort-appointments'

interface UseGetShowingsReturn {
  isLoading: boolean
  showings: IShowing[]
  appointments: IShowingAppointment[]
}

function useGetShowings(): UseGetShowingsReturn {
  const { data: rows, isLoading, run } = useAsync<IShowing[]>({ data: [] })

  useEffect(() => {
    run(getShowings)
  }, [run])

  const appointments = useMemo(
    () =>
      rows.reduce<IShowingAppointment[]>(
        (acc, value) =>
          value.appointments ? acc.concat(value.appointments) : acc,
        []
      ),
    [rows]
  )

  const sortedAppointments = useSortAppointments(appointments)

  return {
    isLoading,
    showings: rows,
    appointments: sortedAppointments
  }
}

export default useGetShowings
