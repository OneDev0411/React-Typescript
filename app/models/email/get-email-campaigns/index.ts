import Fetch from 'services/fetch'

import { toEntityAssociation } from 'utils/association-utils'
import { getActiveTeamId } from 'utils/user-teams'

import {
  DEFAULT_EMAIL_ASSOCIATIONS,
  DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS,
  DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS
} from '../get-email-campaign'

export async function getEmailCampaigns<
  A1 extends IEmailCampaignAssociation,
  A2 extends IEmailCampaignRecipientAssociation,
  A3 extends IEmailCampaignEmailAssociation
>(
  user: IUser,
  {
    emailCampaignAssociations = DEFAULT_EMAIL_ASSOCIATIONS as A1[],
    emailRecipientsAssociations = DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS as A2[],
    emailCampaignEmailsAssociation = DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS as A3[]
  }: {
    emailCampaignAssociations?: A1[]
    emailRecipientsAssociations?: A2[]
    emailCampaignEmailsAssociation?: A3[]
  } = {}
): Promise<IEmailCampaign<A1, A2, A3, never>[]> {
  const brandId: UUID | null = getActiveTeamId(user)

  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  const endpoint = `/brands/${brandId}/emails/campaigns`

  const response = await new Fetch().get(endpoint).query({
    'associations[]': [
      ...emailCampaignAssociations.map(toEntityAssociation('email_campaign')),
      ...emailRecipientsAssociations.map(
        toEntityAssociation('email_campaign_recipient')
      ),
      ...emailCampaignEmailsAssociation.map(
        toEntityAssociation('email_campaign_email')
      )
    ],
    'omit[]': ['template_instance.html', 'email_campaign.html']
  })

  return response.body.data
}
