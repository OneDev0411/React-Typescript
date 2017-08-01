import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const getAlerts = async max_value => {
  try {
    const response = await new Fetch()
      .get('/alerts')
      .query({ limit: 10 })
      .query({ max_value })
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
