import { useMemo } from 'react'

import useUnseenNotificationAppointmentIds from '../use-unseen-notification-appointment-ids'

interface UseAppointmentNotificationListsReturn {
  appointments: IShowingAppointment[]
  notifications: IShowingAppointment[]
}

function useAppointmentNotificationLists(
  allAppointments: IShowingAppointment[]
): UseAppointmentNotificationListsReturn {
  const unseenAppointmentId = useUnseenNotificationAppointmentIds()

  return useMemo(
    () =>
      allAppointments.reduce(
        (acc, appointment) => {
          const hasNotification = !!unseenAppointmentId[appointment.id]

          return {
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
          notifications: []
        }
      ),
    [unseenAppointmentId, allAppointments]
  )
}

export default useAppointmentNotificationLists
