import { useMemo } from 'react'

import useUnseenAppointmentNotificationIds from '../../hooks/use-unseen-appointment-notification-ids'

type UseGetShowingNotificationCountReturn = Record<UUID, number>

function useGetShowingNotificationCount(
  showings: IShowing[]
): UseGetShowingNotificationCountReturn {
  const unseenAppointmentNotificationIds = useUnseenAppointmentNotificationIds()

  return useMemo(
    () =>
      showings.reduce<UseGetShowingNotificationCountReturn>((acc, showing) => {
        return {
          ...acc,
          [showing.id]: (showing.appointments ?? []).reduce(
            (count, appointment) =>
              unseenAppointmentNotificationIds[appointment.id]
                ? count + 1
                : count,
            0
          )
        }
      }, {}),
    [unseenAppointmentNotificationIds, showings]
  )
}

export default useGetShowingNotificationCount
