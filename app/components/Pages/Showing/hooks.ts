import { useState, useEffect } from 'react'

import { useLoadingEntities } from 'hooks/use-loading'
import { getPublicShowing } from 'models/showing/get-public-showing'
import { getPublicShowingAppointment } from 'models/showing/get-public-showing-appointment'

interface UsePublicShowing {
  isLoading: boolean
  showing: Nullable<IPublicShowing>
}

export function usePublicShowing(id: number): UsePublicShowing {
  const [showing, setShowing] = useState<Nullable<IPublicShowing>>(null)
  const [isLoading] = useLoadingEntities(showing)

  useEffect(() => {
    async function fetchShowing() {
      const fetchedShowing = await getPublicShowing(id)

      setShowing(fetchedShowing)
    }

    fetchShowing()
  }, [id])

  return {
    isLoading,
    showing
  }
}

interface UseShowingAppointment {
  isLoading: boolean
  appointment: Nullable<IPublicShowingAppointment<'showing'>>
}

export function usePublicShowingAppointment(
  appointmentToken: string
): UseShowingAppointment {
  const [appointment, setAppointment] =
    useState<Nullable<IPublicShowingAppointment<'showing'>>>(null)
  const [isLoading] = useLoadingEntities(appointment)

  useEffect(() => {
    async function fetchAppointment() {
      const fetchedAppointment = await getPublicShowingAppointment(
        appointmentToken
      )

      setAppointment(fetchedAppointment)
    }

    fetchAppointment()
  }, [appointmentToken])

  return {
    isLoading,
    appointment
  }
}
