import Fetch from 'services/fetch'

export async function getSuperCampaign(
  superCampaignId: UUID
): Promise<ISuperCampaign<'template_instance'>> {
  return (
    await new Fetch().get(`/email/super-campaigns/${superCampaignId}`).query({
      associations: [
        'super_campaign.template_instance',
        'template_instance.template',
        'template_instance.listings',
        'template_instance.deals',
        'template_instance.contacts'
      ]
    })
  ).body.data
}
