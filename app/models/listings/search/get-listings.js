import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

export const byValert = async (options, query, hasNeedNormalized = true) => {
  if (!options) {
    return
  }

  try {
    const response = await new Fetch()
      .post('/valerts')
      .send(options)
      .query(query)

    if (!hasNeedNormalized) {
      return response.body
    }

    const { code, info, data } = response.body

    const normilizedListings = normalize(data, schema.listingsList)

    return {
      ...normilizedListings,
      info: {
        code,
        ...info
      }
    }
  } catch (error) {
    throw error
  }
}

export const byMlsNumber = async mlsNumber => {
  if (!mlsNumber) {
    return
  }

  try {
    const response = await new Fetch().get(
      `/listings/search?mls_number=${mlsNumber}`
    )

    const { code, data } = response.body

    const normilizedListings = normalize([data], schema.listingsList)

    return {
      ...normilizedListings,
      info: {
        code,
        total: 1,
        count: 1,
        proposed_title: ''
      }
    }
  } catch (error) {
    throw error
  }
}
