import ConfirmedStatusDetails from './Confirmed'
import RequestedStatusDetails from './Requested'
import RescheduledStatusDetails from './Rescheduled'
import CanceledStatusDetails from './Canceled'
import CompletedStatusDetails from './Completed'
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

  if (appointment.status === 'Rescheduled') {
    return (
      <>
        <RescheduledStatusDetails appointment={appointment} />
        <CancelReschedule appointment={appointment} />
      </>
    )
  }

  if (appointment.status === 'Canceled') {
    return (
      <>
        <CanceledStatusDetails appointment={appointment} />
      </>
    )
  }

  if (appointment.status === 'Completed') {
    return (
      <>
        <CompletedStatusDetails appointment={appointment} />
      </>
    )
  }

  return null
}
