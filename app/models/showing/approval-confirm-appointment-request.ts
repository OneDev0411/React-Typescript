import Fetch from '../../services/fetch'

export async function approvalConfirmAppointmentRequest(
  appointmentToken: UUID,
  message?: string
): Promise<void> {
  await new Fetch()
    .put(`/showings/public/appointments/${appointmentToken}/approval/confirm`)
    .send(message ? { message } : {})
}
