import Fetch from '../../../services/fetch'

export async function removeTrigger(id: UUID): Promise<void> {
  try {
    if (!id) {
      throw new Error('id not provided')
    }

    await new Fetch().delete(`/triggers/${id}`)
  } catch (e) {
    throw e
  }
}
