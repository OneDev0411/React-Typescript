import Fetch from '../../../../services/fetch'

import { getActiveTeamId } from '../../../../utils/user-teams'

async function getAll(user) {
  const brandId = getActiveTeamId(user)

  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  const endpoint = `/brands/${brandId}/emails/campaigns?associations[]=email_campaign.recipients&associations[]=email_campaign_recipient.list&associations[]=email_campaign_recipient.contact`

  try {
    const fetchCampaigns = new Fetch().get(`${endpoint}`)

    const response = await fetchCampaigns

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getAll
