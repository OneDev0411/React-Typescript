import { toEntityAssociation } from 'utils/association-utils'

import Fetch from 'services/fetch'

export async function updateEmailCampaign(
  id: string,
  email: IEmailCampaignInput | IIndividualEmailCampaignInput
): Promise<
  IEmailCampaign<
    'emails' | 'template' | 'from' | 'recipients',
    'contact',
    'email'
  >
> {
  const response = await new Fetch()
    .put(`/emails/${id}`)
    .send(email)
    .query({
      'associations[]': [
        'email_campaign_recipient.contact',
        'email_campaign_email.email',
        ...['emails', 'template', 'from', 'recipients'].map(
          toEntityAssociation('email_campaign')
        )
      ]
    })

  return response.body.data
}
