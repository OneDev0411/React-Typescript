import Fetch from '@app/services/fetch'

export async function getSuperCampaignEligibleAgents(
  superCampaignId: UUID
): Promise<IBrand[]> {
  const response = await new Fetch()
    .get(`/email/super-campaigns/${superCampaignId}/eligible/agents`)
    .query({
      associations: [
        'brand.roles',
        'brand_role.users',
        'user.agent',
        'agent.office'
      ]
    })

  return response.body.data
}
