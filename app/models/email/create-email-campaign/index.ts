import Fetch from '../../../services/fetch'

export async function createEmailCampaign(
  email: IIndividualEmailCampaignInput,
  query = {}
) {
  const response = await new Fetch().post('/emails').send(email).query(query)

  return response.body
}
