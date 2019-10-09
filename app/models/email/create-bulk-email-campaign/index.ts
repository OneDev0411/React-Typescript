import Fetch from 'services/fetch'

export async function createBulkEmailCampaign(
  email: IIndividualEmailCampaignInput
): Promise<IEmailCampaign> {
  const response = await new Fetch().post('/emails/individual').send(email)

  return response.body
}
