import Fetch from 'services/fetch'

async function rejectShowingAppointment(
  showingId: UUID,
  appointmentId: UUID,
  comment?: string
) {
  await new Fetch()
    .put(`/showings/${showingId}/appointments/${appointmentId}/approval`)
    .send({
      approved: false,
      comment
    })
}

export default rejectShowingAppointment
