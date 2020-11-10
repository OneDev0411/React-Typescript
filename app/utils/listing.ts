import { LEASE_PROPERTY_TYPES } from '../constants/listings/property-types'
import { LEASE_PROPERTY_SUBTYPES } from '../constants/listings/property-subtypes'

const ONE_ACRE_TO_SQUARE_METERS = 4046.86
const ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT = 10.7639

export const getStatusColor = (status: IListingStatus): string => {
  switch (status) {
    case 'Active':
    case 'Lease':
    case 'Coming Soon':
      return '32b86d'

    case 'Pending':
    case 'Active Kick Out':
    case 'Active Contingent':
    case 'Active Option Contract':
    case 'Lease Contract':
      return 'f5a544'

    case 'Sold':
    case 'Leased':
    case 'Expired':
    case 'Cancelled':
      return 'd00023'

    default:
      return 'c3c3c3'
  }
}

export const getStatusColorClass = (status: IListingStatus): string => {
  switch (status) {
    case 'Active':
    case 'Lease':
    case 'Coming Soon':
      return 'green'

    case 'Pending':
    case 'Active Kick Out':
    case 'Active Contingent':
    case 'Active Option Contract':
    case 'Lease Contract':
      return 'orange'

    case 'Sold':
    case 'Leased':
    case 'Expired':
    case 'Archived':
    case 'Cancelled':
    case 'Contract Terminated':
      return '#F43B38'

    case 'Withdrawn':
    case 'Temp Off Market':
    case 'Withdrawn Sublisting':
      return '#62778c'

    default:
      return ''
  }
}

export const metersToAcres = (metre: number): number => metre / ONE_ACRE_TO_SQUARE_METERS
export const acresToMeters = (acres: number): number => acres * ONE_ACRE_TO_SQUARE_METERS

export const metersToFeet = (metre: number): number => metre * ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT
export const feetToMeters = (foot: number): number => foot / ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT

export const squareMetersToAcres = (value: number): number => value * 0.000247105

export const localAddress = (address: Address | ICompactAddress): string =>
  `${address.street_number} ${address.street_name} ST ${address.unit_number}`

export const addressTitle = (address: Address | ICompactAddress): string => {
  const street = [
    address.street_number,
    address.street_name,
    address.street_suffix
  ].filter(a => a).join(' ')

  return `${street}${address.unit_number ? ` Unit ${address.unit_number}` : ''
    }`
}

export const getListingAddressField = (listing: IListing | ICompactListing, fieldName: keyof Address | keyof ICompactAddress) => {
  switch (listing.type) {
    case 'compact_listing':
      return listing.address[fieldName]
    case 'listing':
      return listing.property.address[fieldName]
    default:
      return null
  }
}

export const getListingAddressObj = (listingOrProperty: IListing | ICompactListing | Property): Address | ICompactAddress => {
  if (listingOrProperty.type === 'compact_listing' || listingOrProperty.type === 'property') {
    return listingOrProperty.address
  }

  return listingOrProperty.property.address
}

export const getListingAddress = (listing: IListing | ICompactListing): string => {
  const address = getListingAddressObj(listing)

  const { street_number, street_name, street_suffix, unit_number } = address

  let result = [street_number, street_name, street_suffix]
    .filter(s => s)
    .join(' ')

  if (unit_number) {
    result += ` Unit ${address.unit_number}`
  }

  return result
}

export const getDaysOnMarket = (listing: IListing | ICompactListing): number => {
  return Math.floor(listing.dom || 0)
}

export const getCurrentDaysOnMarket = (listing: IListing): number => {
  return Math.floor(listing.cdom || 0)
}

// TODO: remove this unfortunate part of code or fix it
export const getResizeUrl = (full_size_url: OptionalNullable<string>): string => full_size_url || ''
// if (!full_size_url) { return '' }
// let image_replace = full_size_url.replace('http://cdn.rechat.co/', '')
// image_replace = image_replace.replace('http://cdn.rechat.co/', '')
// image_replace = image_replace.replace('https://cdn.rechat.co/', '')
// image_replace = image_replace.replace('https://cdn.rechat.com/', '')
// const imgix_url = `https://rechat.imgix.net/${image_replace}`
// return imgix_url

export const isLeaseProperty = (listing: IListing | ICompactListing) => {
  const isLease = (listing: IListing | ICompactListing) => {
    const unionOfPropertyTypesAndSubtypes = listing.type === 'listing'
      ? [listing.property.property_type, listing.property.property_subtype]
      : [listing.compact_property.property_type]

    return unionOfPropertyTypesAndSubtypes
      .some(t => [
        ...LEASE_PROPERTY_TYPES,
        ...LEASE_PROPERTY_SUBTYPES
      ].includes(t))
  }

  return isLease(listing)
}

export const getListingFeatures = (listing: IListing | ICompactListing): {
  bedroomCount: number,
  bathroomCount: number,
  areaSqft: number,
  lotSizeAreaAcre: number | null
} => {

  const property = listing.type === 'listing' ? listing.property : listing.compact_property

  return {
    bedroomCount: property.bedroom_count,
    bathroomCount: property.bathroom_count,
    areaSqft:
      Math.round(metersToFeet(property.square_meters))
    ,
    lotSizeAreaAcre: property.lot_size_area,
  }
}

export default {
  getStatusColor,
  getStatusColorClass,
  metersToFeet,
  feetToMeters,
  localAddress,
  addressTitle,
  getDaysOnMarket,
  getCurrentDaysOnMarket,
  getResizeUrl,
  squareMetersToAcres,
  isLeaseProperty
}
