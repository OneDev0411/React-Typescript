import { useMemo } from 'react'

import useUnseenNotificationAppointmentIds from '../use-unseen-notification-appointment-ids'

type UseGetShowingNotificationCountReturn = Record<UUID, number>

function useGetShowingNotificationCount(
  showings: IShowing[]
): UseGetShowingNotificationCountReturn {
  const unseenAppointmentId = useUnseenNotificationAppointmentIds()

  return useMemo(
    () =>
      showings.reduce<UseGetShowingNotificationCountReturn>((acc, showing) => {
        return {
          ...acc,
          [showing.id]: (showing.appointments ?? []).reduce(
            (count, appointment) =>
              unseenAppointmentId[appointment.id] ? count + 1 : count,
            0
          )
        }
      }, {}),
    [unseenAppointmentId, showings]
  )
}

export default useGetShowingNotificationCount
