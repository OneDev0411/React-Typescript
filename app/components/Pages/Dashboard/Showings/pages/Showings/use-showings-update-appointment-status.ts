import { Dispatch, SetStateAction } from 'react'

type UseShowingsUpdateAppointmentStatusReturn = (
  appointmentId: UUID,
  status: IAppointmentStatus,
  showingId: UUID
) => void

function useShowingsUpdateAppointmentStatus(
  setShowings: Dispatch<SetStateAction<IShowing[]>>
): UseShowingsUpdateAppointmentStatusReturn {
  return function updateShowingsAppointmentStatus(
    appointmentId: UUID,
    status: IAppointmentStatus,
    showingId: UUID
  ) {
    setShowings(showings => {
      const showingIndex = showings.findIndex(
        showing => showing.id === showingId
      )

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

      appointments.splice(appointmentIndex, 1, {
        ...appointments[appointmentIndex],
        status
      })

      const newShowings = [...showings]

      newShowings.splice(showingIndex, 1, { ...showing, appointments })

      return newShowings
    })
  }
}

export default useShowingsUpdateAppointmentStatus
