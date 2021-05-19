import setShowingAppointmentApproval from './set-showing-appointment-approval'

async function approveShowingAppointment(
  showingId: UUID,
  appointmentId: UUID,
  comment?: string
): Promise<IShowingAppointment> {
  return setShowingAppointmentApproval(showingId, appointmentId, true, comment)
}

export default approveShowingAppointment
