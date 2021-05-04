import { useMemo } from 'react'

interface UseAppointmentNotificationListsReturn {
  appointments: IShowingAppointment[]
  notifications: IShowingAppointment[]
}

function useAppointmentNotificationLists(
  allAppointments: IShowingAppointment[]
): UseAppointmentNotificationListsReturn {
  return useMemo(
    () =>
      allAppointments.reduce<UseAppointmentNotificationListsReturn>(
        (acc, appointment) => {
          const hasNotification = !!appointment.notifications?.length

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
    [allAppointments]
  )
}

export default useAppointmentNotificationLists
