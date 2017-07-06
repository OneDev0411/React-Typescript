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
const prepareStatuses = statuses =>
  Object.keys(statuses).filter(status => statuses[status])
    .map(status => status
        .split('_')
        .map(f => f.charAt(0).toUpperCase() + f.substr(1))
        .join(' ')
    )

const submitFiltersForm = values => (dispatch, getState) => {
  const { options, filters: formState } = getState().search

  const open_house = values.open_house || false
  const listing_statuses = prepareStatuses(values.listing_statuses)

  const queryOptions = {
    ...options,
    open_house,
    listing_statuses
  }

  return getListingsByValert(queryOptions)(dispatch, getState)
}

export default submitFiltersForm
