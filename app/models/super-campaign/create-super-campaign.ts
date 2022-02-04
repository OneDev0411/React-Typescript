import Fetch from 'services/fetch'

export async function createSuperCampaign(
  data: ISuperCampaignInput
): Promise<ISuperCampaign> {
  return (await new Fetch().post('/email/super-campaigns').send(data)).body.data
}
