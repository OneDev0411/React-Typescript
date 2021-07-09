import setShowingAppointmentApproval from './set-showing-appointment-approval'

async function rejectShowingAppointment(
  showingId: UUID,
  appointmentId: UUID,
  comment?: string
): Promise<IShowingAppointment> {
  return setShowingAppointmentApproval(showingId, appointmentId, false, comment)
}

export default rejectShowingAppointment
