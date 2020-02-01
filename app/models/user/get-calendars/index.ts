import Fetch from '../../../services/fetch'

export async function getUserCalendars(gcid: string): Promise<any> {
  const response = await new Fetch().get(`/users/google/${gcid}/calendars`)

  return response.body.data
}
