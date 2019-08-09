// models/brand/index.js
import URL from 'url'

import Fetch from '../../services/fetch'
import config from '../../../config/public'

import DEFAULT_QUERY from './helpers/default-query'

export async function getBrandByHostname(hostname, query = DEFAULT_QUERY) {
  const appHostName = URL.parse(config.app.url).hostname

  if (hostname === appHostName) {
    return null
  }

  try {
    const response = await new Fetch()
      .get('/brands/search')
      .query({ hostname })
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
