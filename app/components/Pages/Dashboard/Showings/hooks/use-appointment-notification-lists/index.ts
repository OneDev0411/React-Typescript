import { useMemo } from 'react'

import useUnseenAppointmentNotificationIds from '../use-unseen-appointment-notification-ids'

interface UseAppointmentNotificationListsReturn {
  appointments: IShowingAppointment[]
  notifications: IShowingAppointment[]
  unseenAppointmentNotificationIds: Record<UUID, UUID>
}

function useAppointmentNotificationLists(
  allAppointments: IShowingAppointment[]
): UseAppointmentNotificationListsReturn {
  const unseenAppointmentNotificationIds = useUnseenAppointmentNotificationIds()

  return useMemo(
    () =>
      allAppointments.reduce<UseAppointmentNotificationListsReturn>(
        (acc, appointment) => {
          const hasNotification = !!unseenAppointmentNotificationIds[
            appointment.id
          ]

          return {
            ...acc,
            appointments: !hasNotification
              ? [...acc.appointments, appointment]
              : acc.appointments,
            notifications: hasNotification
              ? [...acc.notifications, appointment]
              : acc.notifications
          }
        },
        {
          appointments: [],
          notifications: [],
          unseenAppointmentNotificationIds
        }
      ),
    [unseenAppointmentNotificationIds, allAppointments]
  )
}

export default useAppointmentNotificationLists
