import Fetch from 'services/fetch'

async function enrollUserInSuperCampaign(
  superCampaignId: UUID,
  enrollments: ISuperCampaignEnrollmentInput[]
): Promise<ISuperCampaignEnrollment> {
  return (
    await new Fetch()
      .post(`/email/super-campaigns/${superCampaignId}/enrollments`)
      .send({ enrollments })
  ).body.data
}

export default enrollUserInSuperCampaign
