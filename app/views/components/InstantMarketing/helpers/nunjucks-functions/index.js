import flattenBrand from 'utils/flatten-brand'

import config from '../../../../../../config/public'

export const getAsset = (brand, name) =>
  flattenBrand(brand).assets.marketing[name] || ''

export function getListingUrl(activeBrand, listing) {
  const brand = flattenBrand(activeBrand)
  const listing_url = brand.messages && brand.messages.listing_url

  return listing_url
    ? listing_url.replace('%1', listing.mls_number)
    : `${config.app.url}/dashboard/mls/${listing.id}`
}
