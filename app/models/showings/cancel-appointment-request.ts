import Fetch from '../../services/fetch'

export async function cancelAppointmentRequest(
  appointmentId: UUID,
  message?: string
): Promise<void> {
  try {
    await new Fetch()
      .post(`/showings/public/appointments/${appointmentId}/cancel`)
      .send(message ? { message } : {})
  } catch (error) {
    throw error
  }
}
