import Fetch from 'services/fetch'

export async function getMySuperCampaigns(
  limit?: number
): Promise<ISuperCampaign<'template_instance' | 'created_by'>[]> {
  const superCampaigns = (
    await new Fetch().get('/email/super-campaigns/self').query({
      associations: [
        'super_campaign.template_instance',
        'super_campaign.created_by',
        'template_instance.template',
        'template_instance.listings',
        'template_instance.deals',
        'template_instance.contacts'
      ]
    })
  ).body.data

  if (!limit) {
    return superCampaigns
  }

  return superCampaigns.slice(0, limit) // TODO: Use the limit param on the request if possible later
}
