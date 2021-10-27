import Fetch from 'services/fetch'

async function getSuperCampaignEnrollments(
  superCampaignId: UUID
): Promise<ISuperCampaignEnrollment<'user_and_brand'>[]> {
  return (
    await new Fetch()
      .get(`/email/super-campaigns/${superCampaignId}/enrollments`)
      .query({
        associations: [
          // TODO: Put brand and user associations here
        ]
      })
  ).body.data // TODO: Remove this when the related API is ready
    .map((enrollment, idx) => ({
      ...enrollment,
      brand: { name: `Mock Brand ${idx}` } as any,
      user: { display_name: `Mock User ${idx}` } as any
    }))
}

export default getSuperCampaignEnrollments
