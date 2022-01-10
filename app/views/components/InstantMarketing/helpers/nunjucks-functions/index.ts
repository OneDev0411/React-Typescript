import _get from 'lodash/get'

import config from 'config'
import { DEFAULT_BRAND_PALETTE } from 'utils/constants'
import flattenBrand from 'utils/flatten-brand'

export function getListingUrl(
  activeBrand: IBrand,
  listing: IListing & { isMock?: true }
) {
  if (!listing) {
    return ''
  }

  if (listing.isMock) {
    return listing.url ?? ''
  }

  if (listing.url) {
    return listing.url
  }

  const brand = flattenBrand(activeBrand)
  const listing_url = brand?.messages?.listing_url ?? ''

  return listing_url
    ? listing_url.replace('%1', listing.mls_number)
    : `${config.app.url}/dashboard/mls/${listing.id}`
}

export function get(brand: IBrand, key: BrandMarketingPaletteKey): string {
  const defaultValue = _get(DEFAULT_BRAND_PALETTE, key)
  const mergedBrand = flattenBrand(brand)

  return _get(mergedBrand, `settings.marketing_palette.${key}`, defaultValue)
}
