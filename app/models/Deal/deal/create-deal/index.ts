import Fetch from '../../../../services/fetch'

/**
 * create new deal
 */
export async function create(data: object) {
  try {
    const response = await new Fetch()
      .post('/deals')
      .query({ 'associations[]': ['deal.checklists'] })
      .query({ 'associations[]': ['deal.brand'] })
      .query({ 'associations[]': ['deal.property_type'] })
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}
