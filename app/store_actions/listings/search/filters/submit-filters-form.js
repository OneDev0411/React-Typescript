import { submit, SubmissionError } from 'redux-form'
import getListings from '../get-listings'
import { generatePointsFromBounds } from '../../../../utils/map'
import setSearchListingsOptions from '../../../../store_actions/listings/search/set-options'
import toogleFiltersArea from '../../../../store_actions/listings/search/filters/toggle-filters-area'
import { goToPlace } from '../../map'
import { selectListings } from '../../../../reducers/listings'
import extendedBounds from '../../../../utils/extendedBounds'
import { normalizeListingsForMarkers } from '../../../../utils/map'
import { removePolygon } from '../../../../store_actions/listings/map/drawing'

// Initial valert options {
//   limit: '250',
//   property_types: ['Residential'],
//   listing_statuses: [
//     'Active',
//     'Active Contingent',
//     'Active Kick Out',
//     'Active Option Contract'
//   ],
//   points: [
//     {
//       latitude: 32.83938955111425,
//       longitude: -96.89115626525879
//     },
//     {
//       latitude: 32.83938955111425,
//       longitude: -96.70284373474121
//     },
//     {
//       latitude: 32.71396625328302,
//       longitude: -96.70284373474121
//     },
//     {
//       latitude: 32.71396625328302,
//       longitude: -96.89115626525879
//     },
//     {
//       latitude: 32.83938955111425,
//       longitude: -96.89115626525879
//     }
//   ],
//   property_subtypes: [
//     'RES-Single Family',
//     'RES-Half Duplex',
//     'RES-Farm/Ranch',
//     'RES-Condo',
//     'RES-Townhouse'
//   ]
// }

// listing_statuses
// [
//   "Active",
//   "Sold",
//   "Pending",
//   "Temp Off Market",
//   "Leased",
//   "Active Option Contract",
//   "Active Contingent",
//   "Active Kick Out",
//   "Withdrawn",
//   "Expired",
//   "Cancelled",
//   "Withdrawn Sublisting",
//   "Incomplete",
//   "Unknown",
//   "Incoming",
//   "Coming Soon"
// ]

const turnToNumber = value =>
  value ? Number(value.replace(/[^0-9]/g, '')) : null

const getSoldDate = (selectedMonth = 3) => {
  const date = new Date(Date.now())
  return date.setMonth(date.getMonth() - selectedMonth) / 1000
}

const normalizeNumberValues = values => {
  const numberValues = Object.keys(values).filter(
    v =>
      (v.indexOf('minimum') === 0 || v.indexOf('maximum') === 0) &&
      v.indexOf('sold') === -1
  )

  const normalizedValues = {}
  numberValues.forEach(v => {
    normalizedValues[v] = turnToNumber(values[v]) || null
  })

  return normalizedValues
}

const normalizPoolValue = value => {
  switch (value) {
    case 'NO':
      return false
    case 'YES':
      return true
    default:
      return null
  }
}

const ignoreNullValues = values => {
  const withoutNullValues = {}

  Object.keys(values).forEach(v => {
    const value = values[v]
    if (value == null) {
      return
    }
    withoutNullValues[v] = value
  })

  return withoutNullValues
}

export const obiectPropsValueToArray = obj =>
  !obj
    ? null
    : Object.keys(obj)
        .map(p => {
          const value = obj[p]
          if (!value) {
            return
          }
          return value
        })
        .filter(v => v)

const normalizeValues = (values, state) => {
  const { options, filters: formState } = state

  const {
    counties,
    mls_areas,
    subdivisions,
    school_districts,
    high_schools,
    middle_schools,
    primary_schools,
    elementary_schools,
    senior_high_schools,
    junior_high_schools,
    intermediate_schools
  } = values

  const listing_statuses = obiectPropsValueToArray(values.listing_statuses)
  const open_house = !!values.open_house

  if (listing_statuses.length === 0) {
    let alertMsg = 'You must select at least one listing status'

    if (open_house) {
      alertMsg += ' "Open House" filter'
    }

    window.alert(alertMsg)

    throw new SubmissionError({
      listing_statuses: alertMsg,
      _error: 'Filter Faild'
    })
  }

  let minimum_sold_date
  const pool = normalizPoolValue(values.pool)

  if (values.listing_statuses.sold) {
    minimum_sold_date = getSoldDate(Number(values.minimum_sold_date))
  }

  const property_subtypes = obiectPropsValueToArray(values.property_subtypes)
  const architectural_styles = obiectPropsValueToArray(
    values.architectural_styles
  )

  const points =
    mls_areas || school_districts || subdivisions || counties
      ? null
      : options.points

  const nextOptions = {
    ...options,
    points,
    listing_statuses,
    property_subtypes,
    architectural_styles,
    open_house,
    counties,
    mls_areas,
    subdivisions,
    school_districts,
    high_schools,
    middle_schools,
    primary_schools,
    elementary_schools,
    senior_high_schools,
    junior_high_schools,
    intermediate_schools,
    pool,
    minimum_sold_date,
    ...normalizeNumberValues(values)
  }

  const queryOptions = ignoreNullValues(nextOptions)

  Object.keys(options).forEach(o => {
    if (options[o] && typeof queryOptions[o] === 'undefined') {
      queryOptions[o] = null
    }
  })

  if (typeof queryOptions.points === 'undefined') {
    const { map } = state
    queryOptions.points = generatePointsFromBounds(map.props.bounds)
  }

  // console.log(options, values, queryOptions)

  return queryOptions
}

const submitFiltersForm = values => async (dispatch, getState) => {
  const queryOptions = normalizeValues(values, getState().search)

  const updateMap = () => {
    const { search } = getState()
    const { points: drawingPoints, shape: drawingShape } = search.map.drawing
    const listings = selectListings(search.listings)

    dispatch(toogleFiltersArea())

    if (drawingPoints.length > 2 && queryOptions.points == null) {
      dispatch(removePolygon(drawingShape))
    }

    if (listings.length === 1) {
      const { latitude: lat, longitude: lng } = listings[0].location
      goToPlace({ center: { lat, lng } })(dispatch, getState)
      return
    }

    if (listings.length && window.google) {
      const extendedProps = extendedBounds(
        normalizeListingsForMarkers(listings),
        search.map.props
      )

      if (!extendedProps) {
        const { latitude: lat, longitude: lng } = listings[0].location
        goToPlace({ center: { lat, lng }, zoom: 16 })(dispatch, getState)
        return
      }

      goToPlace(extendedProps)(dispatch, getState)
    }
  }

  if (queryOptions.postal_codes) {
    await getListings.byPostalCode(queryOptions.postal_codes, queryOptions)(
      dispatch,
      getState
    )
    updateMap()
  }

  await getListings.byValert(queryOptions)(dispatch, getState)
  updateMap()
}

export default submitFiltersForm
