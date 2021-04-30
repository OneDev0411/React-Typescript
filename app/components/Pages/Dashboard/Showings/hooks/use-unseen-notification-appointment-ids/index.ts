import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { getGlobalNotificationsList } from 'selectors/globalNotifications'

function useUnseenNotificationAppointmentIds(): Record<UUID, true> {
  const notifications = useSelector(getGlobalNotificationsList)

  return useMemo(
    () =>
      notifications.reduce(
        (items, notification) =>
          notification.object_class === 'ShowingAppointment' &&
          !notification.seen
            ? { ...items, [notification.object]: true }
            : items,
        {}
      ),
    [notifications]
  )
}

export default useUnseenNotificationAppointmentIds
