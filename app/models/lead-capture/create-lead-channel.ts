import Fetch from '@app/services/fetch'

interface Data {
  sourceType: 'Zillow'
}

export async function createLeadChannel(
  brand: UUID,
  data: Data
): Promise<LeadChannel> {
  try {
    const response = await new Fetch()
      .post(`/brands/${brand}/leads/channels`)
      .send(data)

    return response.body.data
  } catch (e) {
    console.log(e)

    throw e
  }
}
