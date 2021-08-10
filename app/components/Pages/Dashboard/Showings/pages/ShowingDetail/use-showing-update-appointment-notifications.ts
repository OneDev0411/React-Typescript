import { Dispatch, SetStateAction } from 'react'

import useShowingNotifications from 'hooks/use-showing-notifications'

import { sortAppointments } from '../../helpers'

import { updateAppointmentState } from './helpers'

function useShowingUpdateAppointmentNotifications(
  setShowing: Dispatch<SetStateAction<IShowing<'showing'>>>
): void {
  const handleShowingAppointmentCreate = (notification: INotification) => {
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
        appointments: sortAppointments(appointments)
      }
    })
  }

  const handleShowingAppointmentRescheduleCancel = (
    notification: INotification
  ) => {
    const appointment: IShowingAppointment<'showing'> = notification.objects[0]

    updateAppointmentState(setShowing, appointment.id, oldAppointment => ({
      ...oldAppointment,
      ...appointment,
      notifications: oldAppointment.notifications
        ? [...oldAppointment.notifications, notification]
        : [notification],
      approvals: null
    }))
  }

  useShowingNotifications({
    onShowingAppointmentCreated: handleShowingAppointmentCreate,
    onShowingAppointmentRescheduled: handleShowingAppointmentRescheduleCancel,
    onShowingAppointmentCanceled: handleShowingAppointmentRescheduleCancel
  })
}

export default useShowingUpdateAppointmentNotifications
