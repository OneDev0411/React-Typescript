import { useMemo } from 'react'

type UseShowingGroupAppointmentByVisitorIdReturn = Record<
  UUID,
  IShowingAppointment<'showing'>[]
>

function useShowingGroupAppointmentByVisitorId(
  appointments: IShowingAppointment<'showing'>[]
): UseShowingGroupAppointmentByVisitorIdReturn {
  return useMemo(
    () =>
      appointments.reduce<UseShowingGroupAppointmentByVisitorIdReturn>(
        (acc, appointment) => ({
          ...acc,
          [appointment.contact.id]: acc[appointment.contact.id]
            ? [...acc[appointment.contact.id], appointment]
            : [appointment]
        }),
        {}
      ),
    [appointments]
  )
}

export default useShowingGroupAppointmentByVisitorId
