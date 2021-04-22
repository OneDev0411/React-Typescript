import ApprovedStatusDetails from './Approved'
import RequestedStatusDetails from './Requested'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentStatusDetails({
  appointment
}: Props) {
  if (appointment.status === 'Approved') {
    return <ApprovedStatusDetails appointment={appointment} />
  }

  if (appointment.status === 'Requested') {
    return <RequestedStatusDetails appointment={appointment} />
  }

  return null
}
