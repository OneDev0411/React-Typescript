import Fetch from '../../../services/fetch'

interface ContactsMergeClusterInput {
  parent: UUID
  sub_contacts: UUID[]
}

export async function mergeContactsBatch(
  clusters: ContactsMergeClusterInput[]
): Promise<ApiResponseBody<unknown>> {
  try {
    const response = await new Fetch().post('/contacts/merge').send({
      clusters
    })

    return response.body.data
  } catch (error) {
    throw error
  }
}
