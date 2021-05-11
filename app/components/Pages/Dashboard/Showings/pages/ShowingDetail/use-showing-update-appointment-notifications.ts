import { Dispatch, SetStateAction } from 'react'

import useShowingNotifications from 'hooks/use-showing-notifications'

function useShowingUpdateAppointmentNotifications(
  setShowing: Dispatch<SetStateAction<IShowing>>
): void {
  const handleShowingAppointment = (notification: INotification) => {
    setShowing(showing => {
      if (!showing) {
        return showing
      }

      const appointments = showing.appointments ? [...showing.appointments] : []

      appointments.push({
        ...notification.objects[0],
        showing: {
          ...showing,
          appointments: null
        },
        contact: notification.subjects[0],
        notifications: [notification]
      })

      return {
        ...showing,
        appointments
      }
    })
  }

  useShowingNotifications({ onShowingAppointment: handleShowingAppointment })
}

export default useShowingUpdateAppointmentNotifications
