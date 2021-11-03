import Fetch from 'services/fetch'

async function getSuperCampaignEnrollments(
  superCampaignId: UUID
): Promise<ISuperCampaignEnrollment<'user_and_brand'>[]>
async function getSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: true
): Promise<ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]>
async function getSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: boolean
): Promise<
  | ISuperCampaignEnrollment<'user_and_brand'>[]
  | ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]
>
async function getSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: boolean = false
): Promise<
  | ISuperCampaignEnrollment<'user_and_brand'>[]
  | ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]
> {
  const associations = [
    'super_campaign_enrollment.user',
    'super_campaign_enrollment.brand'
  ]

  if (includeCampaign) {
    associations.push('super_campaign_enrollment.campaign')
  }

  return (
    await new Fetch()
      .get(`/email/super-campaigns/${superCampaignId}/enrollments`)
      .query({
        associations
      })
  ).body.data
}

export default getSuperCampaignEnrollments
