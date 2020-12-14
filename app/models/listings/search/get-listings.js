import { normalize } from 'normalizr'

import Fetch from '../../../services/fetch'

import * as schema from '../schema'

function filterListingsWithoutLocation(listings) {
  return listings.filter(l => l.location != null)
}

export const byValert = async (
  filters,
  query,
  hasNeedNormalized = true,
  queryParam = ''
) => {
  try {
    const response = await new Fetch()
      .post(`/valerts${queryParam}`)
      .send(filters)
      .query(query)

    if (!hasNeedNormalized) {
      return response.body
    }

    const { code, info, data } = response.body

    const normilizedListings = normalize(
      filterListingsWithoutLocation(data),
      schema.listingsList
    )

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

    const normilizedListings = normalize(
      [filterListingsWithoutLocation(data)],
      schema.listingsList
    )

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
