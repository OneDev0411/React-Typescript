import { Dispatch, SetStateAction } from 'react'

export function updateShowingsAppointmentState(
  setShowings: Dispatch<SetStateAction<IShowing[]>>,
  showingId: UUID,
  appointmentId: UUID,
  modifier: (appointment: IShowingAppointment) => IShowingAppointment
) {
  setShowings(showings => {
    const showingIndex = showings.findIndex(showing => showing.id === showingId)

    if (showingIndex === -1) {
      return showings
    }

    const showing = showings[showingIndex]

    if (!showing.appointments) {
      return showings
    }

    const appointments = [...showing.appointments]
    const appointmentIndex = appointments.findIndex(
      appointment => appointment.id === appointmentId
    )

    if (appointmentIndex === -1) {
      return showings
    }

    appointments.splice(
      appointmentIndex,
      1,
      modifier({ ...appointments[appointmentIndex] })
    )

    const newShowings = [...showings]

    newShowings.splice(showingIndex, 1, { ...showing, appointments })

    return newShowings
  })
}
