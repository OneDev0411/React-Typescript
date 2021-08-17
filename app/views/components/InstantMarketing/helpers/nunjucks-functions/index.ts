import _get from 'lodash/get'

import { DEFAULT_BRAND_PALETTE } from 'utils/constants'

export function getListingUrl(activeBrand: IBrand, listing: IListing) {
  if (!listing) {
    return ''
  }

  if (listing.url) {
    return listing.url
  }

  return ''
}

export function get(brand: IBrand, key: BrandMarketingPaletteKey): string {
  const defaultValue = _get(DEFAULT_BRAND_PALETTE, key)

  return _get(brand, `settings.marketing_palette.${key}`, defaultValue)
}
