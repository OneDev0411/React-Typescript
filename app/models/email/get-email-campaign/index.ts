import Fetch from 'services/fetch'
import { toEntityAssociation } from 'utils/association-utils'

const DEFAULT_EMAIL_ASSOCIATIONS: EmailCampaignAssociation[] = [
  'emails',
  'template',
  'from',
  'recipients',
  'attachments'
]

const DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS: EmailCampaignRecipientAssociation[] = [
  'contact',
  'list'
]

export async function getEmailCampaign<
  A1 extends EmailCampaignAssociation,
  A2 extends EmailCampaignRecipientAssociation
>(
  id,
  associations: A1[] = DEFAULT_EMAIL_ASSOCIATIONS as A1[],
  recipientAssociations: A2[] = DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS as A2[]
): Promise<IEmailCampaign<A1, A2>> {
  const response = await new Fetch().get(`/emails/${id}`).query({
    associations: [
      ...associations.map(toEntityAssociation('email_campaign')),
      ...recipientAssociations.map(
        toEntityAssociation('email_campaign_recipient')
      )
    ]
  })

  return response.body.data as IEmailCampaign<A1, A2>
}
