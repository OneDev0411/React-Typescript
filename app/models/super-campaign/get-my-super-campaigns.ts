import Fetch from 'services/fetch'

async function getMySuperCampaigns(): Promise<
  ISuperCampaign<'template_instance'>[]
> {
  return (
    await new Fetch().get('/email/super-campaigns/self').query({
      associations: ['super_campaign.template_instance']
    })
  ).body.data
}

export default getMySuperCampaigns
