import Fetch from 'services/fetch'

async function approveShowingAppointment(
  showingId: UUID,
  appointmentId: UUID,
  comment?: string
) {
  await new Fetch()
    .put(`/showings/${showingId}/appointments/${appointmentId}/approval`)
    .send({
      approved: true,
      comment
    })
}

export default approveShowingAppointment
