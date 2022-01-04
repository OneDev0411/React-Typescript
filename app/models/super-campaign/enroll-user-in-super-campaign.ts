import Fetch from 'services/fetch'

import { defaultAssociations } from './get-super-campaign-enrollments'

async function enrollUserInSuperCampaign(
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

export default enrollUserInSuperCampaign
