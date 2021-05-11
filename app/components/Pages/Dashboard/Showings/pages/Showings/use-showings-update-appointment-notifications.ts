import { Dispatch, SetStateAction } from 'react'

import useShowingNotifications from 'hooks/use-showing-notifications'

function useShowingsUpdateAppointmentNotifications(
  setShowings: Dispatch<SetStateAction<IShowing[]>>
): void {
  const handleShowingAppointment = (notification: INotification) => {
    const showingId: UUID = notification.objects[0].showing_id

    setShowings(showings => {
      const showingIndex = showings.findIndex(
        showing => showing.id === showingId
      )

      if (showingIndex === -1) {
        return showings
      }

      const showing = showings[showingIndex]

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

      const newShowings = [...showings]

      newShowings.splice(showingIndex, 1, { ...showing, appointments })

      return newShowings
    })
  }

  useShowingNotifications({ onShowingAppointment: handleShowingAppointment })
}

export default useShowingsUpdateAppointmentNotifications
