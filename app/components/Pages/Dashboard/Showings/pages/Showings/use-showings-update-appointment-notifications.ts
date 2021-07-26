import { Dispatch, SetStateAction } from 'react'

import useShowingNotifications from 'hooks/use-showing-notifications'

import { sortAppointments } from '../../helpers'

import { updateShowingsAppointmentState } from './helpers'

function useShowingsUpdateAppointmentNotifications(
  setShowings: Dispatch<SetStateAction<IShowing<'showing'>[]>>
): void {
  const handleShowingAppointmentCreate = (notification: INotification) => {
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

      newShowings.splice(showingIndex, 1, {
        ...showing,
        appointments: sortAppointments(appointments)
      })

      return newShowings
    })
  }

  const handleShowingAppointmentRescheduleCancel = (
    notification: INotification
  ) => {
    const appointment: IShowingAppointment = notification.objects[0]
    const showingId: UUID = notification.objects[0].showing_id

    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointment.id,
      oldAppointment => ({
        ...oldAppointment,
        ...appointment,
        showing: oldAppointment.showing,
        notifications: oldAppointment.notifications
          ? [...oldAppointment.notifications, notification]
          : [notification],
        approvals: null
      })
    )
  }

  useShowingNotifications({
    onShowingAppointmentCreated: handleShowingAppointmentCreate,
    onShowingAppointmentRescheduled: handleShowingAppointmentRescheduleCancel,
    onShowingAppointmentCanceled: handleShowingAppointmentRescheduleCancel
  })
}

export default useShowingsUpdateAppointmentNotifications
