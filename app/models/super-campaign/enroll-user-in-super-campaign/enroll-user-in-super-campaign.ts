import Fetch from 'services/fetch'

import { defaultAssociations } from '../get-all-super-campaign-enrollments'

export async function enrollUserInSuperCampaign(
  superCampaignId: UUID,
  enrollments: ISuperCampaignEnrollmentInput[]
): Promise<ISuperCampaignEnrollment<'user' | 'brand'>[]> {
  return (
    await new Fetch()
      .post(`/email/super-campaigns/${superCampaignId}/enrollments`)
      .query({
        associations: defaultAssociations
      })
      .send({ enrollments })
  ).body.data
}
