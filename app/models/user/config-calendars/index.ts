import Fetch from '../../../services/fetch'

interface RequestBody {
  toSync: string[]
  toStopSync: string[]
}

export async function configCalendars(
  gcid: string,
  data: RequestBody
): Promise<void> {
  await new Fetch().post(`/users/google/${gcid}/conf`).send(data)
}
