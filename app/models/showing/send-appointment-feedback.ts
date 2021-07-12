import Fetch from '../../services/fetch'

export async function sendAppointmentFeedback(
  appointmentToken: UUID,
  data: IShowingAppointmentFeedbackInput
): Promise<void> {
  const response = await new Fetch()
    .post(`/showings/public/appointments/${appointmentToken}/feedback`)
    .send(data)

  if (response.status >= 400) {
    throw response.error
  }
}
