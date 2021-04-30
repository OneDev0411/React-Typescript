import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { getGlobalNotificationsList } from 'selectors/globalNotifications'

type UseUnseenAppointmentNotificationIdsReturn = Record<UUID, UUID>

function useUnseenAppointmentNotificationIds(): UseUnseenAppointmentNotificationIdsReturn {
  const notifications = useSelector(getGlobalNotificationsList)

  return useMemo(
    () =>
      notifications.reduce<UseUnseenAppointmentNotificationIdsReturn>(
        (items, notification) =>
          notification.object_class === 'ShowingAppointment' &&
          !notification.seen
            ? { ...items, [notification.object]: notification.id }
            : items,
        {}
      ),
    [notifications]
  )
}

export default useUnseenAppointmentNotificationIds
