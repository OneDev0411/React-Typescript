import Fetch from 'services/fetch'

export async function setEmailNotificationStatus(
  emailCampaignId: UUID,
  notificationEnabled: boolean
): Promise<void> {
  await new Fetch()
    .put(`/emails/${emailCampaignId}/notifications`)
    .send({ status: notificationEnabled })
}
