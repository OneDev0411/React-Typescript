import Fetch from 'services/fetch'

async function getSuperCampaignEnrollments(
  superCampaignId: UUID
): Promise<ISuperCampaignEnrollment<'user_and_brand'>[]> {
  return (
    await new Fetch({ proxy: false })
      .get(`/email/super-campaigns/${superCampaignId}/enrollments`)
      .query({
        associations: [
          'super_campaign_enrollment.user',
          'super_campaign_enrollment.brand'
        ]
      })
  ).body.data
}

export default getSuperCampaignEnrollments
