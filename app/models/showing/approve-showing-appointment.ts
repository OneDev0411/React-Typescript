import Fetch from 'services/fetch'

async function approveShowingAppointment(
  showingId: UUID,
  appointmentId: UUID,
  comment?: string
): Promise<IShowingAppointment> {
  return (
    await new Fetch()
      .put(`/showings/${showingId}/appointments/${appointmentId}/approval`)
      .send({
        approved: true,
        comment
      })
  ).body.data
}

export default approveShowingAppointment
