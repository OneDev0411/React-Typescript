import Fetch from '@app/services/fetch'

export async function deleteLeadChannel(
  brand: UUID,
  channel: UUID
): Promise<void> {
  try {
    await new Fetch().delete(`/brands/${brand}/leads/channels/${channel}`)
  } catch (e) {
    console.log(e)

    throw e
  }
}
