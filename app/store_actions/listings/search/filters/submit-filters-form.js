import { SubmissionError } from 'redux-form'
import getListings from '../get-listings'
import { toNumber } from '../../../../utils/helpers'
import { generatePointsFromBounds } from '../../../../utils/map'
import setSearchInput from '../../../../store_actions/listings/search/set-search-input'
import toogleFiltersArea from '../../../../store_actions/listings/search/filters/toggle-filters-area'
import { goToPlace } from '../../map'
import { selectListings } from '../../../../reducers/listings'
import extendedBounds from '../../../../utils/extendedBounds'
import { normalizeListingsForMarkers } from '../../../../utils/map'
import {
  removePolygon,
  inactiveDrawing
} from '../../../../store_actions/listings/map/drawing'
import { feetToMeters, acresToMeters } from '../../../../../app/utils/listing'
import { SCHOOLS_TYPE } from '../../../../components/Pages/Dashboard/Listings/Search/components/Filters/Schools'

import { SEARCH_BY_FILTERS_AREAS } from '../../../../constants/listings/search'
import {
  reset as resetSearchType,
  setSearchType
} from '../../../../store_actions/listings/search/set-type'

// Initial valert options {
//   limit: '250',
//   property_types: ['Residential'],
//   listing_statuses: [
//     'Active',
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

const MULTI_SELECT_FIELDS = [
  'counties',
  'subdivisions',
  'school_districts',
  ...SCHOOLS_TYPE
]

const turnToNumber = value => {
  if (!value || value == null) {
    return null
  }

  return typeof value === 'number' ? value : toNumber(value)
}

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

  const unitIsFoot = n => n.indexOf('square_meters') !== -1
  const unitIsAcre = n => n.indexOf('lot_square_meters') !== -1

  const normalizedValues = {}

  numberValues.forEach(v => {
    let numberValue = turnToNumber(values[v]) || null

    if (unitIsAcre(v)) {
      normalizedValues[v] = acresToMeters(numberValue)
    } else if (unitIsFoot(v)) {
      normalizedValues[v] = feetToMeters(numberValue)
    } else {
      normalizedValues[v] = numberValue
    }
  })

  if (values.priceZeroCleaner) {
    const { minimum_price, maximum_price } = normalizedValues

    if (minimum_price) {
      normalizedValues.minimum_price = minimum_price * 1000
    }

    if (maximum_price) {
      normalizedValues.maximum_price = maximum_price * 1000
    }
  }

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

    if (value === null) {
      return
    }

    withoutNullValues[v] = value
  })

  return withoutNullValues
}

export const getObjectValues = obj =>
  obj != null && Object.keys(obj).length > 0
    ? Object.values(obj).filter(i => i)
    : []

const normalizedMlsAreas = areas => {
  const areasByParents = {}

  areas.forEach(({ value, parent }) => {
    if (
      parent !== 0 &&
      areasByParents['0'] &&
      areasByParents['0'].indexOf(parent) === 0
    ) {
      areasByParents['0'] = areasByParents['0'].filter(p => p !== parent)
    }

    areasByParents[parent] = !areasByParents[parent]
      ? [value]
      : [...areasByParents[parent], value]
  })

  const mls_areas = []

  Object.keys(areasByParents).forEach(parent =>
    areasByParents[parent].forEach(mlsNumber => {
      mls_areas.push([mlsNumber, Number(parent)])
    })
  )

  if (mls_areas.length === 0) {
    return null
  }

  return mls_areas
}

const normalizMultiSelectedInputOptions = options => {
  if (Array.isArray(options) && options.length > 0) {
    return options.map(({ label }) => label)
  }

  return null
}

const normalizeValues = (values, options, state) => {
  const open_house = !!values.open_house

  const { mlsAreas = [], mlsSubareas = [] } = values
  const mls_areas = normalizedMlsAreas([...mlsAreas, ...mlsSubareas])

  const listing_statuses = getObjectValues(values.listing_statuses)

  if (listing_statuses.length === 0) {
    let alertMsg = 'Please select at least one listing status.'

    window.alert(alertMsg)

    throw new SubmissionError({
      listing_statuses: alertMsg,
      _error: 'Filter Faild'
    })
  }

  const pool = normalizPoolValue(values.pool)

  const property_subtypes = getObjectValues(values.property_subtypes)
  const architectural_styles = getObjectValues(values.architectural_styles)

  const multiSelectFields = {}

  MULTI_SELECT_FIELDS.forEach(fielld => {
    multiSelectFields[fielld] = normalizMultiSelectedInputOptions(
      values[fielld]
    )
  })

  const { school_districts, subdivisions, counties } = multiSelectFields
  const hasAreasOptions =
    mls_areas || school_districts || subdivisions || counties

  const points = hasAreasOptions ? null : options.points

  let { postal_codes } = options

  if (hasAreasOptions && postal_codes) {
    postal_codes = null
  }

  let nextOptions = {
    ...options,
    points,
    listing_statuses,
    property_subtypes,
    architectural_styles,
    open_house,
    mls_areas,
    pool,
    postal_codes,
    ...multiSelectFields,
    ...normalizeNumberValues(values)
  }

  if (values.listing_statuses.sold) {
    const minimum_sold_date = getSoldDate(Number(values.minimum_sold_date))

    nextOptions = Object.assign(nextOptions, { minimum_sold_date })
  }

  const queryOptions = ignoreNullValues(nextOptions)

  Object.keys(options).forEach(o => {
    if (options[o] && typeof queryOptions[o] === 'undefined') {
      queryOptions[o] = null
    }
  })

  if (typeof queryOptions.points === 'undefined' && !hasAreasOptions) {
    const { map } = state

    queryOptions.points = generatePointsFromBounds(map.props.marginBounds)
  }

  // console.group('Submitted Filters')
  // console.log('Options:', options)
  // console.log('Values:', values)
  // console.log('queryOptions:', queryOptions)
  // console.groupEnd()

  return {
    ...queryOptions,
    property_types: ['Residential']
  }
}

const submitFiltersForm = values => async (dispatch, getState) => {
  const state = getState().search
  const { options } = state

  Object.keys(options).forEach(o => {
    if (options[o] && typeof values[o] === 'undefined') {
      options[o] = null
    }
  })

  const queryOptions = normalizeValues(values, options, state)

  const updateMap = () => {
    const { search } = getState()
    const hasSearchInput = search.input
    const { points: drawingPoints, shape: drawingShape } = search.map.drawing
    const listings = selectListings(search.listings)

    dispatch(toogleFiltersArea())

    if (drawingPoints.length > 2 && queryOptions.points === null) {
      dispatch(removePolygon(drawingShape))
      dispatch(inactiveDrawing())
    }

    if (hasSearchInput && queryOptions.points === null) {
      dispatch(setSearchInput(''))
    }

    // if (listings.length === 1) {
    //   const { latitude: lat, longitude: lng } = listings[0].location

    //   goToPlace({ center: { lat, lng } })(dispatch, getState)
    // }

    if (queryOptions.points == null && listings.length && window.google) {
      const extendedProps = extendedBounds(
        normalizeListingsForMarkers(listings),
        search.map.props
      )

      dispatch(setSearchType(SEARCH_BY_FILTERS_AREAS))

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
  } else {
    await getListings.byValert(queryOptions)(dispatch, getState)
  }

  updateMap()
}

export default submitFiltersForm
