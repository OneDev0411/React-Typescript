import Fetch from 'services/fetch'

export async function updateSuperCampaign(
  superCampaignId: UUID,
  data: ISuperCampaignInput
): Promise<ISuperCampaign> {
  return (
    await new Fetch()
      .put(`/email/super-campaigns/${superCampaignId}`)
      .send(data)
  ).body.data
}
