import Fetch from 'services/fetch'

export async function updateEmailCampaign(
  id: string,
  email: IEmailCampaignInput | IIndividualEmailCampaignInput
) {
  const response = await new Fetch().put(`/emails/${id}`).send(email)

  return response.body
}
