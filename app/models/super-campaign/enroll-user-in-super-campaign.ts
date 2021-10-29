import Fetch from 'services/fetch'

async function enrollUserInSuperCampaign(
  superCampaignId: UUID,
  data: ISuperCampaignEnrollmentInput
): Promise<ISuperCampaignEnrollment> {
  return (
    await new Fetch()
      .post(`/email/super-campaigns/${superCampaignId}/enrollments`)
      .send(data)
  ).body.data
}

export default enrollUserInSuperCampaign
