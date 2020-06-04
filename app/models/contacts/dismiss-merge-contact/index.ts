import Fetch from '../../../services/fetch'

export async function dismissMergeContact(clusterId: number, contactId: UUID) {
  try {
    return await new Fetch().delete(
      `/contacts/duplicates/${clusterId}/contacts/${contactId}`
    )
  } catch (error) {
    throw error
  }
}
