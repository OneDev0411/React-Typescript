import getListingsByValert from './by-valert'
import { getFetchingStatus } from '../../../../reducers/listings'

const QUERY_LIMIT = 200

const getListingsByPostalCode = (postalCode, options = {}) => (
  dispatch,
  getState
) => {
  if (getFetchingStatus(getState().search.listings)) {
    return Promise.resolve()
  }

  options =
    Object.keys(options).length > 0 ? options : getState().search.options

  const queryOptions = {
    ...options,
    points: null,
    counties: null,
    mls_areas: null,
    school_districts: null,
    postal_codes: Array.isArray(postalCode) ? postalCode : [postalCode],
    limit: QUERY_LIMIT
  }

  return getListingsByValert(queryOptions)(dispatch, getState)
}

export default getListingsByPostalCode
