import Fetch from '../../../services/fetch'

export async function createEmailCampaign(
  email: IIndividualEmailCampaignInput
) {
  const response = await new Fetch().post('/emails').send(email)

  return response.body
}
