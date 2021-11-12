import { getAgents } from '@app/models/Deal/agent'

async function getSuperCampaignEligibleAgents(
  brandId: UUID
): Promise<IBrand[]> {
  // TODO: Use the real model here when it is deployed and ready to use
  // GET /email/super-campaigns/:super_campaign_id/eligible/agents
  return getAgents(brandId)
}

export default getSuperCampaignEligibleAgents
