import Fetch from 'services/fetch'

async function getMySuperCampaigns(): Promise<
  ISuperCampaign<'template_instance'>[]
> {
  return (
    await new Fetch().get('/email/super-campaigns/self').query({
      associations: ['super_campaign.template_instance']
      // limit: '2' // TODO: Ask the API guys about this
    })
  ).body.data
    .filter(item => !!item.template_instance)
    .slice(0, 2) // TODO: Remove this when the API supports limit
}

export default getMySuperCampaigns
