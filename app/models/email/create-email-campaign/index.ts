import Fetch from '../../../services/fetch'

export async function createEmailCampaign(
  email: IIndividualEmailCampaignInput,
  query = {},
  individualMode?: boolean
) {
  const path = individualMode ? '/emails/individual' : '/emails'
  const response = await new Fetch().post(path).send(email).query(query)

  return response.body
}
