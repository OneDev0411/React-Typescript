import Fetch from 'services/fetch'

export async function getEmail(
  id
): Promise<
  IEmailCampaign<
    'recipients' | 'from' | 'template' | 'emails',
    'contact' | 'list'
  >
> {
  const response = await new Fetch().get(`/emails/${id}`).query({
    associations: [
      'email_campaign.emails',
      'email_campaign.template',
      'email_campaign.from',
      'email_campaign.recipients',
      'email_campaign_recipient.list',
      'email_campaign_recipient.contact'
    ]
  })

  return response.body.data
}
