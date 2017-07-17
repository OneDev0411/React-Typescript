import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const getAlerts = async () => {
  try {
    const response = await new Fetch().get('/alerts')
    const alerts = response.body.data

    return normalize(alerts, schema.listingsList)
  } catch (error) {
    throw error
  }
}

export default getAlerts
