import Fetch from 'services/fetch'

async function setShowingAppointmentApproval(
  showingId: UUID,
  appointmentId: UUID,
  approved: boolean,
  comment?: string
): Promise<IShowingAppointment> {
  return (
    await new Fetch()
      .put(`/showings/${showingId}/appointments/${appointmentId}/approval`)
      .query({
        associations: [
          'showing_appointment.contact',
          'showing_appointment.approvals',
          'showing_approval.role',
          'showing_appointment.notifications'
        ]
      })
      .send({
        approved,
        comment
      })
  ).body.data
}

export default setShowingAppointmentApproval
