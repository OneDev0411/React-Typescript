import Fetch from '../../services/fetch'

export async function createAppointmentRequest(
  numericId: number,
  data: IShowingAppointmentInput
): Promise<IPublicShowingAppointment> {
  const response = await new Fetch()
    .post(`/showings/public/${numericId}/appointments`)
    .send(data)

  return response.body.data
}
