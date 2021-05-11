import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

import useAsync from 'hooks/use-async'

import getShowing from 'models/showing/get-showing'

import useShowingUpdateAppointmentNotifications from './use-showing-update-appointment-notifications'

interface UseGetShowingReturn {
  showing: Nullable<IShowing>
  isLoading: boolean
  setShowing: Dispatch<SetStateAction<Nullable<IShowing>>>
}

function useGetShowing(showingId: UUID): UseGetShowingReturn {
  const { data, run, error, isLoading, setData } = useAsync<IShowing>()

  useEffect(() => {
    if (!error) {
      run(async () => getShowing(showingId))
    }
  }, [run, showingId, error])

  const showing = useMemo<Nullable<IShowing>>(
    () =>
      data
        ? {
            ...data,
            appointments:
              data.appointments?.map(appointment => ({
                ...appointment,
                showing: {
                  ...data,
                  appointments: null
                }
              })) ?? null
          }
        : data,
    [data]
  )

  useShowingUpdateAppointmentNotifications(setData)

  return {
    showing,
    isLoading,
    setShowing: setData
  }
}

export default useGetShowing
