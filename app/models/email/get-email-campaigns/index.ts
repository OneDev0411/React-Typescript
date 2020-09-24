import Fetch from 'services/fetch'

import { toEntityAssociation } from 'utils/association-utils'
import { getActiveTeamId } from 'utils/user-teams'

export const DEFAULT_EMAIL_ASSOCIATIONS: IEmailCampaignAssociation[] = [
  'emails',
  'template',
  'from',
  'recipients',
  'attachments'
]

export const DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS: IEmailCampaignRecipientAssociation[] = [
  'contact',
  'list',
  'brand',
  'agent'
]

export const DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS: IEmailCampaignEmailAssociation[] = [
  'email'
]

export interface GetEmailCampaignsAssociations<
  A1 extends IEmailCampaignAssociation,
  A2 extends IEmailCampaignRecipientAssociation,
  A3 extends IEmailCampaignEmailAssociation
> {
  emailCampaignAssociations?: A1[]
  emailRecipientsAssociations?: A2[]
  emailCampaignEmailsAssociation?: A3[]
}

export async function getEmailCampaigns<
  A1 extends IEmailCampaignAssociation,
  A2 extends IEmailCampaignRecipientAssociation,
  A3 extends IEmailCampaignEmailAssociation
>(
  user: IUser,
  associations: GetEmailCampaignsAssociations<A1, A2, A3> = {}
): Promise<IEmailCampaign<A1, A2, A3, never>[]> {
  const {
    emailCampaignAssociations = DEFAULT_EMAIL_ASSOCIATIONS as A1[],
    emailRecipientsAssociations = DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS as A2[],
    emailCampaignEmailsAssociation = DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS as A3[]
  } = associations

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
