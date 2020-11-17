import Fetch from '../../../services/fetch'

export async function removeTrigger(id: UUID): Promise<void> {
  try {
    await new Fetch().delete(`/triggers/${id}`)
  } catch (e) {
    throw e
  }
}
