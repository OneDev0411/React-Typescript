import { useDispatch } from 'react-redux'

import { markNotificationAsSeen } from 'actions/notifications'

function useMarkAppointmentNotificationAsSeen(
  unseenAppointmentNotificationIds: Record<UUID, UUID>
) {
  const dispatch = useDispatch()

  return async (appointmentId: UUID) => {
    const notificationId = unseenAppointmentNotificationIds[appointmentId]

    if (!notificationId) {
      return
    }

    dispatch(markNotificationAsSeen(notificationId))
  }
}

export default useMarkAppointmentNotificationAsSeen
