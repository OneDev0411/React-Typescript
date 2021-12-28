import Fetch from 'services/fetch'

async function setSuperCampaignEnrollmentNotificationsEnabled(
  superCampaignId: UUID,
  enabled: boolean
): Promise<void> {
  await new Fetch()
    .patch(`/email/super-campaigns/${superCampaignId}/enrollments/self`)
    .send({ notifications_enabled: enabled })
}

export default setSuperCampaignEnrollmentNotificationsEnabled
