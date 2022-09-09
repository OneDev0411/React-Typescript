import Fetch from '../../services/fetch'

export async function approvalRejectAppointmentRequest(
  appointmentToken: UUID,
  message?: string
): Promise<void> {
  await new Fetch()
    .put(`/showings/public/appointments/${appointmentToken}/approval/reject`)
    .send(message ? { message } : {})
}
