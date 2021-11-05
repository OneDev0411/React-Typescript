import Fetch from 'services/fetch'

async function getMySuperCampaigns(): Promise<
  ISuperCampaign<'template_instance'>[]
> {
  return (
    await new Fetch().get('/email/super-campaigns/self').query({
      associations: ['super_campaign.template_instance']
    })
  ).body.data.slice(0, 4) // TODO: Use the limit param on the request if possible later
}

export default getMySuperCampaigns
