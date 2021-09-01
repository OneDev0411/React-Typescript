import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from 'hooks/use-async'
import getShowing from 'models/showing/get-showing'

import { sortAppointments, sortShowingAvailabilities } from '../../helpers'

import useShowingUpdateAppointmentNotifications from './use-showing-update-appointment-notifications'

interface UseGetShowingReturn {
  showing: Nullable<IShowing<'showing'>>
  isLoading: boolean
  setShowing: Dispatch<SetStateAction<Nullable<IShowing<'showing'>>>>
}

function useGetShowing(showingId: UUID): UseGetShowingReturn {
  const { data, run, error, isLoading, setData } = useAsync<
    Nullable<IShowing<'showing'>>
  >({
    data: null,
    status: 'pending'
  })

  useEffect(() => {
    if (!error) {
      run(async () => {
        const showing = await getShowing(showingId)

        return {
          ...showing,
          availabilities: sortShowingAvailabilities(showing.availabilities),
          appointments: showing.appointments
            ? sortAppointments(
                showing.appointments.map(appointment => ({
                  ...appointment,
                  showing: {
                    ...showing,
                    appointments: null
                  }
                }))
              )
            : null
        }
      })
    }
  }, [run, showingId, error])

  useShowingUpdateAppointmentNotifications(setData)

  return {
    showing: data,
    isLoading,
    setShowing: setData
  }
}

export default useGetShowing
