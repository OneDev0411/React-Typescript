import Fetch from 'services/fetch'

async function getAllSuperCampaign(): Promise<any> {
  return (
    await new Fetch().post('/email/super-campaigns/filter').query({
      associations: [
        // 'super_campaign.template_instance',
        // 'template_instance.template',
        // 'template_instance.listings',
        // 'template_instance.deals',
        // 'template_instance.contacts'
      ]
    })
  ).body.data
}

export default getAllSuperCampaign
