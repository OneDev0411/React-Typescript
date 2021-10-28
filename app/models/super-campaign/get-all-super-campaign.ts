import Fetch from 'services/fetch'

async function getAllSuperCampaign(): Promise<
  ISuperCampaign<'template_instance'>[]
> {
  const response = await new Fetch()
    .post('/email/super-campaigns/filter')
    .send()

  return response.body.data
}

export default getAllSuperCampaign
