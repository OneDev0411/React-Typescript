import Fetch from 'services/fetch'
import { toEntityAssociation } from 'utils/association-utils'

export const DEFAULT_EMAIL_ASSOCIATIONS: IEmailCampaignAssociation[] = [
  'emails',
  'template',
  'from',
  'recipients',
  'attachments'
]

// eslint-disable-next-line max-len
export const DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS: IEmailCampaignRecipientAssociation[] =
  ['contact', 'list', 'brand', 'agent']

// eslint-disable-next-line max-len
export const DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS: IEmailCampaignEmailAssociation[] =
  ['email']

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
  brandId: Nullable<UUID>,
  associations: GetEmailCampaignsAssociations<A1, A2, A3> = {}
): Promise<IEmailCampaign<A1, A2, A3, never>[]> {
  const {
    emailCampaignAssociations = DEFAULT_EMAIL_ASSOCIATIONS as A1[],
    emailRecipientsAssociations = DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS as A2[],
    // eslint-disable-next-line max-len
    emailCampaignEmailsAssociation = DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS as A3[]
  } = associations

  if (!brandId) {
    throw new Error('the current user does not belong to any brand')
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
