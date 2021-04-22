import ConfirmedStatusDetails from './Confirmed'
import RequestedStatusDetails from './Requested'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentStatusDetails({
  appointment
}: Props) {
  if (appointment.status === 'Confirmed') {
    return <ConfirmedStatusDetails appointment={appointment} />
  }

  if (appointment.status === 'Requested') {
    return <RequestedStatusDetails appointment={appointment} />
  }

  return null
}
