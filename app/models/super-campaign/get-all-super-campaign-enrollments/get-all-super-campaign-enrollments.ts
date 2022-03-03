import Fetch from 'services/fetch'

export const defaultAssociations = [
  'super_campaign_enrollment.user',
  'super_campaign_enrollment.brand'
]

export async function getAllSuperCampaignEnrollments(
  superCampaignId: UUID
): Promise<ISuperCampaignEnrollment<'user' | 'brand'>[]>
export async function getAllSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: true
): Promise<ISuperCampaignEnrollment<'user' | 'brand' | 'campaign'>[]>
export async function getAllSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: boolean
): Promise<
  | ISuperCampaignEnrollment<'user' | 'brand'>[]
  | ISuperCampaignEnrollment<'user' | 'brand' | 'campaign'>[]
>
export async function getAllSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: boolean = false
): Promise<
  | ISuperCampaignEnrollment<'user' | 'brand'>[]
  | ISuperCampaignEnrollment<'user' | 'brand' | 'campaign'>[]
> {
  const associations = [...defaultAssociations]

  if (includeCampaign) {
    associations.push('super_campaign_enrollment.campaign')
  }

  return (
    await new Fetch()
      .get(`/email/super-campaigns/${superCampaignId}/enrollments`)
      .query({
        associations
      })
  ).body.data
}
