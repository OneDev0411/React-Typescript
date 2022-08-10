import Fetch from '@app/services/fetch'

interface Data {
  brand: UUID
}

export async function updateLeadChannel(
  brand: UUID,
  channel: UUID,
  data: Data
): Promise<LeadChannel> {
  try {
    const response = await new Fetch()
      .put(`/brands/${brand}/leads/channels/${channel}`)
      .send(data)

    return response.body.data
  } catch (e) {
    console.log(e)

    throw e
  }
}
