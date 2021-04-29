import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { getGlobalNotificationsList } from 'selectors/globalNotifications'

type UseGetShowingNotificationCountReturn = Record<UUID, number>

function useGetShowingNotificationCount(
  showings: IShowing[]
): UseGetShowingNotificationCountReturn {
  const notifications = useSelector(getGlobalNotificationsList)

  return useMemo(() => {
    const unseenAppointments: Record<UUID, true> = notifications.reduce(
      (items, notification) =>
        notification.object_class === 'ShowingAppointment' && !notification.seen
          ? { ...items, [notification.object]: true }
          : items,
      {}
    )

    const showingNotificationCount: UseGetShowingNotificationCountReturn = {}

    return showings.reduce((acc, showing) => {
      return {
        ...acc,
        [showing.id]: (showing.appointments ?? []).reduce(
          (count, appointment) =>
            unseenAppointments[appointment.id] ? count + 1 : count,
          0
        )
      }
    }, showingNotificationCount)
  }, [notifications, showings])
}

export default useGetShowingNotificationCount
