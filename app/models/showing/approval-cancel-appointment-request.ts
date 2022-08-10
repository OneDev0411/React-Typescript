import Fetch from '../../services/fetch'

export async function approvalCancelAppointmentRequest(
  appointmentToken: UUID,
  message?: string
): Promise<void> {
  await new Fetch()
    .put(`/showings/public/appointments/${appointmentToken}/approval/cancel`)
    .send(message ? { message } : {})
}
