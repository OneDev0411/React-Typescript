import Fetch from '../../../services/fetch'

interface ContactsMergeCluster {
  parent: UUID
  sub_contacts: UUID[]
}

export async function mergeContactsBatch(
  clusters: ContactsMergeCluster[]
): Promise<unknown> {
  try {
    const response = await new Fetch().post('/contacts/merge').send({
      clusters
    })

    return response.body.data
  } catch (error) {
    throw error
  }
}
