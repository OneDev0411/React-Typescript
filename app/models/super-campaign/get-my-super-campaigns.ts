import Fetch from 'services/fetch'

async function getMySuperCampaigns(
  limit?: number
): Promise<ISuperCampaign<'template_instance'>[]> {
  const superCampaigns = (
    await new Fetch().get('/email/super-campaigns/self').query({
      associations: [
        'super_campaign.template_instance',
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

export default getMySuperCampaigns
