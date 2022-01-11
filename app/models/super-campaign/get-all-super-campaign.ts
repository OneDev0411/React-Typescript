import Fetch from 'services/fetch'

export type FetchRange = {
  start: number
  limit: number
}

export async function getAllSuperCampaign(
  range: FetchRange,
  order?: string[]
): Promise<ISuperCampaign[]> {
  const response = await new Fetch()
    .post('/email/super-campaigns/filter')
    .send({ ...range, order })

  return response.body.data
}
