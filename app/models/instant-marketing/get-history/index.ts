import Fetch from '../../../services/fetch'

export async function getHistory(query): Promise<IMarketingTemplateInstance[]> {
  try {
    const response = await new Fetch().get('/templates/instances').query(query)

    return response.body.data
  } catch (e) {
    throw e
  }
}
