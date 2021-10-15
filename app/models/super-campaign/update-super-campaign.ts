import Fetch from 'services/fetch'

async function updateSuperCampaign(
  superCampaignId: UUID,
  data: ISuperCampaignInput
): Promise<ISuperCampaign> {
  return (
    await new Fetch()
      .put(`/email/super-campaigns/${superCampaignId}`)
      .send(data)
  ).body.data
}

export default updateSuperCampaign
