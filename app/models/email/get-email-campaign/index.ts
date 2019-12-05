import Fetch from 'services/fetch'
import { toEntityAssociation } from 'utils/association-utils'

const DEFAULT_EMAIL_ASSOCIATIONS: IEmailCampaignAssociation[] = [
  'emails',
  'template',
  'from',
  'recipients',
  'attachments'
]

const DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS: IEmailCampaignRecipientAssociation[] = [
  'contact',
  'list',
  'brand',
  'agent'
]

const DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS: IEmailCampaignEmailAssociation[] = [
  'email'
]

export async function getEmailCampaign<
  A1 extends IEmailCampaignAssociation,
  A2 extends IEmailCampaignRecipientAssociation,
  A3 extends IEmailCampaignEmailAssociation,
  E extends IEmailOptionalFields
>(
  id,
  associations: A1[] = DEFAULT_EMAIL_ASSOCIATIONS as A1[],
  recipientAssociations: A2[] = DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS as A2[],
  emailCampaignEmailAssociation: A3[] = DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS as A3[],
  emailFields: E[] = [] as E[]
): Promise<IEmailCampaign<A1, A2, A3, E>> {
  const response = await new Fetch().get(`/emails/${id}`).query({
    associations: [
      ...associations.map(toEntityAssociation('email_campaign')),
      ...recipientAssociations.map(
        toEntityAssociation('email_campaign_recipient')
      ),
      ...emailCampaignEmailAssociation.map(
        toEntityAssociation('email_campaign_email')
      )
    ],
    select: emailFields.map(toEntityAssociation('email'))
  })

  return response.body.data as IEmailCampaign<A1, A2, A3, E>
}
