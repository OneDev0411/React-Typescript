import Fetch from '../../services/fetch'

const defaultQuery = {
  associations: [
    'brand_flow.steps',
    'brand_flow_step.event',
    'brand_flow_step.email'
  ]
}

export async function getBrandFlows(id, query = defaultQuery) {
  if (!id) {
    throw new Error(`The brand id must be a UUID. ${id}`)
  }

  try {
    const response = await new Fetch().get(`/brands/${id}/flows`).query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
