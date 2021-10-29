import Fetch from 'services/fetch'

async function updateSuperCampaignTags(
  superCampaignId: UUID,
  tags: string[]
): Promise<ISuperCampaign> {
  return (
    await new Fetch()
      .put(`/email/super-campaigns/${superCampaignId}/tags`)
      .send({ tags })
  ).body.data
}

export default updateSuperCampaignTags
