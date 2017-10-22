import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const getAlerts = async (params = {}) => {
  const { limit, since_value, max_value } = params

  try {
    const response = await new Fetch()
      .get('/alerts')
      .query({ limit: limit || 500 })
      .query({ max_value })
      .query({ since_value })
      .query({ sorting_value: 'Update' })

    const { info, data } = response.body

    return {
      ...normalize(data, schema.listingsList),
      info
    }
  } catch (error) {
    throw error
  }
}

export default getAlerts
