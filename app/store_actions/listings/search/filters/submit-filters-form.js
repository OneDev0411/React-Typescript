import { submit } from 'redux-form'
import getListingsByValert from '../get-listings/by-valert'

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

// Filters Form initialValues {
//   statuses: {
//     sold: false,
//     active: true,
//     canclled: false,
//     expired: false,
//     contingent: false,
//     kick_out: false,
//     option_contract: false,
//     pending: false,
//     temp_off_market: false,
//     withdrawn: false,
//     withdrawn_sublisting: false
//   },
//   open_house: false,
//   soldListingsDate: 'lastThreeMonth'
// }

// listing_statuses
// [
//   Active,
//   Sold,
//   Pending,
//   "Temp Off Market",
//   Leased,
//   "Active Option Contract",
//   "Active Contingent",
//   "Active Kick Out",
//   Withdrawn,
//   Expired,
//   Cancelled,
//   "Withdrawn Sublisting",
//   Incomplete,
//   Unknown,
//   Incoming,
//   "Coming Soon"
// ]

const turnToNumber = value => Number(value.replace(/[^0-9]/g, ''))

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
    const value = turnToNumber(values[v])

    if (!value) {
      return
    }

    normalizedValues[v] = value
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

const obiectPropsValueToArray = obj =>
  Object.keys(obj)
    .map(p => {
      const value = obj[p]
      if (!value) {
        return
      }
      return value
    })
    .filter(v => v)

const submitFiltersForm = values => (dispatch, getState) => {
  const { options, filters: formState } = getState().search

  let minimum_sold_date
  const pool = normalizPoolValue(values.pool)
  const open_house = values.open_house ? true : null

  if (values.listing_statuses.sold) {
    minimum_sold_date = getSoldDate(Number(values.minimum_sold_date))
  }

  const listing_statuses = obiectPropsValueToArray(values.listing_statuses)
  const property_subtypes = obiectPropsValueToArray(values.property_subtypes)
  const architectural_styles = obiectPropsValueToArray(
    values.architectural_styles
  )

  const {
    counties,
    mls_areas,
    subdivisions,
    high_schools,
    middle_schools,
    primary_schools,
    elementary_schools,
    senior_high_schools,
    junior_high_schools,
    intermediate_schools
  } = values

  const withoutNullValues = ignoreNullValues({
    open_house,
    counties,
    mls_areas,
    subdivisions,
    high_schools,
    middle_schools,
    primary_schools,
    elementary_schools,
    senior_high_schools,
    junior_high_schools,
    intermediate_schools,
    pool,
    minimum_sold_date
  })

  const queryOptions = {
    ...options,
    listing_statuses,
    property_subtypes,
    architectural_styles,
    ...withoutNullValues,
    ...normalizeNumberValues(values)
  }

  console.log(values, queryOptions)

  return getListingsByValert(queryOptions)(dispatch, getState)
}

export default submitFiltersForm
