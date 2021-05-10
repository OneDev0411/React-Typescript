import Fetch from '../../services/fetch'

export async function rescheduleAppointmentRequest(
  appointmentToken: UUID,
  data: IShowingAppointmentRescheduleInput
): Promise<IPublicShowingAppointment> {
  const response = await new Fetch()
    .post(`/showings/public/appointments/${appointmentToken}/reschedule`)
    .send(data)

  return response.body.data
}
