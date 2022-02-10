import Fetch from 'services/fetch'

export interface DataInput {
  notifications_enabled?: boolean
  tags?: string[]
}

export async function updateMySuperCampaignEnrollment(
  superCampaignId: UUID,
  data: DataInput
): Promise<void> {
  await new Fetch()
    .patch(`/email/super-campaigns/${superCampaignId}/enrollments/self`)
    .send(data)
}
