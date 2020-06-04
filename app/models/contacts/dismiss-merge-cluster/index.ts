import Fetch from '../../../services/fetch'

export async function dismissMergeCluster(clusterId: number) {
  try {
    return await new Fetch().delete(`/contacts/duplicates/${clusterId}`)
  } catch (error) {
    throw error
  }
}
