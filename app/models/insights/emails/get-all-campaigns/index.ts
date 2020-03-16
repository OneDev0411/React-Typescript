import Fetch from '../../../../services/fetch'

import { getActiveTeamId } from '../../../../utils/user-teams'

async function getAll(user: IUser): Promise<Array<IEmailCampaign>> {
  const brandId: UUID | null = getActiveTeamId(user)

  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  const endpoint = `/brands/${brandId}/emails/campaigns?associations[]=email_campaign.recipients&associations[]=email_campaign_recipient.list&associations[]=email_campaign.template`

  try {
    const response = await new Fetch().get(endpoint)

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getAll
