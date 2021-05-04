import Fetch from '../../services/fetch'

export async function cancelAppointmentRequest(
  appointmentToken: UUID,
  message?: string
): Promise<void> {
  await new Fetch()
    .post(`/showings/public/appointments/${appointmentToken}/cancel`)
    .send(message ? { message } : {})
}
