import { Dispatch, SetStateAction } from 'react'

type UseUpdateAppointmentStatusReturn = (
  appointmentId: UUID,
  status: IAppointmentStatus
) => void

function useUpdateAppointmentStatus(
  setShowing: Dispatch<SetStateAction<IShowing>>
): UseUpdateAppointmentStatusReturn {
  return function updateAppointmentStatus(
    appointmentId: UUID,
    status: IAppointmentStatus
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

      appointments.splice(appointmentIndex, 1, {
        ...appointments[appointmentIndex],
        status
      })

      return { ...showing, appointments }
    })
  }
}

export default useUpdateAppointmentStatus
