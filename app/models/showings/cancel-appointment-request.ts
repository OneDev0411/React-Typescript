import Fetch from '../../services/fetch'

export async function cancelAppointmentRequest(
  appointmentToken: UUID,
  message?: string
): Promise<void> {
  try {
    await new Fetch()
      .post(`/showings/public/appointments/${appointmentToken}/cancel`)
      .send(message ? { message } : {})
  } catch (error) {
    throw error
  }
}
