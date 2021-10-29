// import Fetch from 'services/fetch'

import { getSuperCampaignEnrollmentsRequestBase } from './get-super-campaign-enrollments'

async function getSuperCampaignResults(
  superCampaignId: UUID
): Promise<ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]> {
  // return getSuperCampaignEnrollmentsRequestBase(superCampaignId, true)

  // TODO: Remove this when the API is ready
  return (
    await getSuperCampaignEnrollmentsRequestBase<
      ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]
    >(superCampaignId, true)
  ).map(enrollment => ({
    ...enrollment,
    campaign: {
      sent: 2500,
      delivered: 2400,
      opened: 2000,
      clicked: 1000
    } as any
  }))
}

export default getSuperCampaignResults
