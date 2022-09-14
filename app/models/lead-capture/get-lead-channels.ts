import Fetch from '@app/services/fetch'

export async function getLeadChannels(brand: UUID): Promise<LeadChannel[]> {
  try {
    const response = await new Fetch().get(`/brands/${brand}/leads/channels`)

    return response.body.data
  } catch (e) {
    console.log(e)

    throw e
  }
}
