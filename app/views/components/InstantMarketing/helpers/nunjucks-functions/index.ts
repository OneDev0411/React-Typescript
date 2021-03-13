import _get from 'lodash/get'

import flattenBrand from 'utils/flatten-brand'
import { DEFAULT_BRAND_PALETTE } from 'utils/constants'

import config from '../../../../../../config/public'

export function getListingUrl(activeBrand: IBrand, listing: IListing) {
  const brand = flattenBrand(activeBrand)
  const listing_url = brand && brand.messages ? brand.messages.listing_url : ''

  return listing_url
    ? listing_url.replace('%1', listing.mls_number)
    : `${config.app.url}/dashboard/mls/${listing.id}`
}

export function get(brand: IBrand, key: BrandMarketingPaletteKey): string {
  const defaultValue = _get(DEFAULT_BRAND_PALETTE, key)

  return _get(brand, `settings.palette.palette.${key}`, defaultValue)
}
