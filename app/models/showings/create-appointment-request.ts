import Fetch from '../../services/fetch'

export async function createAppointmentRequest(
  token: string,
  data: IShowingAppointmentInput
): Promise<void> {
  try {
    await new Fetch().post(`/showings/public/${token}/appointments`).send(data)
  } catch (error) {
    throw error
  }
}
