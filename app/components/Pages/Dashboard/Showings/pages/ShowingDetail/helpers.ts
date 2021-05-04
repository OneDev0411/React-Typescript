import { Dispatch, SetStateAction } from 'react'

export function updateAppointmentState(
  setShowing: Dispatch<SetStateAction<IShowing>>,
  appointmentId: UUID,
  modifier: (appointment: IShowingAppointment) => IShowingAppointment
) {
  setShowing(showing => {
    if (!showing.appointments) {
      return showing
    }

    const appointments = [...showing.appointments]

    const appointmentIndex = appointments.findIndex(
      appointment => appointment.id === appointmentId
    )

    if (appointmentIndex === -1) {
      return showing
    }

    appointments.splice(
      appointmentIndex,
      1,
      modifier({ ...appointments[appointmentIndex] })
    )

    return { ...showing, appointments }
  })
}
