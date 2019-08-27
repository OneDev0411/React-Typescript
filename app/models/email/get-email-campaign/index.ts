import Fetch from 'services/fetch'
import { toEntityAssociation } from 'utils/association-utils'

export async function getEmailCampaign<
  A1 extends EmailCampaignAssociation,
  A2 extends EmailCampaignRecipientAssociation
>(
  id,
  associations: A1[] = ['emails', 'template', 'from', 'recipients'] as A1[],
  recipientAssociations: A2[] = ['contact', 'list'] as A2[]
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
