import { Dispatch, SetStateAction } from 'react'

export function updateAppointmentState(
  setShowing: Dispatch<SetStateAction<IShowing<'showing'>>>,
  appointmentId: UUID,
  modifier: (
    appointment: IShowingAppointment<'showing'>
  ) => IShowingAppointment<'showing'>
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
