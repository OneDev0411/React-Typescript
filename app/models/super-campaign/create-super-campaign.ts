import Fetch from 'services/fetch'

async function createSuperCampaign(
  data: ISuperCampaignInput
): Promise<ISuperCampaign> {
  return (await new Fetch().post('/email/super_campaigns').send(data)).body.data
}

export default createSuperCampaign
