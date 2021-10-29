import Fetch from 'services/fetch'

export async function getSuperCampaignEnrollmentsRequestBase<T>(
  superCampaignId: UUID,
  includeCampaign: boolean
): Promise<T> {
  const associations = [
    'super_campaign_enrollment.user',
    'super_campaign_enrollment.brand'
  ]

  if (includeCampaign) {
    associations.push('super_campaign_enrollment.campaign')
  }

  return (
    await new Fetch({ proxy: false })
      .get(`/email/super-campaigns/${superCampaignId}/enrollments`)
      .query({
        associations
      })
  ).body.data
}

async function getSuperCampaignEnrollments(
  superCampaignId: UUID
): Promise<ISuperCampaignEnrollment<'user_and_brand'>[]> {
  return getSuperCampaignEnrollmentsRequestBase(superCampaignId, false)
}

export default getSuperCampaignEnrollments
