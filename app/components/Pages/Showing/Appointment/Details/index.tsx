import ConfirmedStatusDetails from './Confirmed'
import RequestedStatusDetails from './Requested'
import CancelReschedule from './CancelReschedule'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentStatusDetails({
  appointment
}: Props) {
  if (appointment.status === 'Confirmed') {
    return (
      <>
        <ConfirmedStatusDetails appointment={appointment} />
        <CancelReschedule appointment={appointment} />
      </>
    )
  }

  if (appointment.status === 'Requested') {
    return (
      <>
        <RequestedStatusDetails appointment={appointment} />
        <CancelReschedule appointment={appointment} />
      </>
    )
  }

  return null
}
