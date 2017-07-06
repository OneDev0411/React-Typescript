import getListingsByValert from './by-valert'
import { getFetchingStatus } from '../../../../reducers/listings'
import { queryOptions } from '../../../../components/Pages/Dashboard/Mls/Partials/MlsMapOptions'

const QUERY_LIMIT = 100

const getListingsByPostalCode = postalCode => (dispatch, getState) => {
  if (getFetchingStatus(getState().search.listings)) {
    return Promise.resolve()
  }

  const options = {
    ...getState().search.options,
    points: null,
    counties: null,
    mls_areas: null,
    school_districts: null,
    postal_codes: [postalCode],
    limit: QUERY_LIMIT
  }

  return getListingsByValert(options)(dispatch, getState)
}

export default getListingsByPostalCode
