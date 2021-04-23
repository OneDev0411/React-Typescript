import Fetch from 'services/fetch'

async function rejectShowingAppointment(
  showingId: UUID,
  appointmentId: UUID,
  comment?: string
) {
  return (
    await new Fetch()
      .put(`/showings/${showingId}/appointments/${appointmentId}/approval`)
      .send({
        approved: false,
        comment
      })
  ).body.data
}

export default rejectShowingAppointment
