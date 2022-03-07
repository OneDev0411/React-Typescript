import Fetch from '@app/services/fetch'

export async function updateSuperCampaignEligibility(
  superCampaignId: UUID,
  eligibleBrands: UUID[]
): Promise<ISuperCampaign> {
  return (
    await new Fetch()
      .put(`/email/super-campaigns/${superCampaignId}/eligibility`)
      .send({ eligible_brands: eligibleBrands })
  ).body.data
}
