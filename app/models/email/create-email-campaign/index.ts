import { toEntityAssociation } from 'utils/association-utils'

import Fetch from 'services/fetch'

export async function createEmailCampaign(
  email: IEmailCampaignInput | IIndividualEmailCampaignInput
): Promise<
  IEmailCampaign<
    'emails' | 'template' | 'from' | 'recipients',
    'contact',
    'email'
  >
> {
  const path = email.individual ? '/emails/individual' : '/emails'
  const response = await new Fetch()
    .post(path)
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
