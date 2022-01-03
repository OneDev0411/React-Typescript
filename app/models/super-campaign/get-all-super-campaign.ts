import Fetch from 'services/fetch'

export type FetchRange = {
  start: number
  limit: number
}

async function getAllSuperCampaign(
  range: FetchRange
): Promise<ISuperCampaign[]> {
  const response = await new Fetch()
    .post('/email/super-campaigns/filter')
    .send({ ...range })

  return response.body.data
}

export default getAllSuperCampaign
