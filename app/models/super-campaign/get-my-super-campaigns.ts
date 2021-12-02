import Fetch from 'services/fetch'

async function getMySuperCampaigns(): Promise<
  ISuperCampaign<'template_instance'>[]
> {
  return (
    await new Fetch().get('/email/super-campaigns/self').query({
      associations: [
        'super_campaign.template_instance',
        'template_instance.template',
        'template_instance.listings',
        'template_instance.deals',
        'template_instance.contacts'
      ]
    })
  ).body.data.slice(0, 4) // TODO: Use the limit param on the request if possible later
}

export default getMySuperCampaigns
