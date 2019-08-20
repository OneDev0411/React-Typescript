import lodashGet from 'lodash/get'

import flattenBrand from 'utils/flatten-brand'

import config from '../../../../../../config/public'

export const getAsset = (activeBrand: IBrand, name: string) => {
  const brand = flattenBrand(activeBrand)

  if (brand && brand.assets && brand.assets.marketing) {
    return lodashGet(brand.assets.marketing, name)
  }

  return ''
}

export function getListingUrl(activeBrand: IBrand, listing: any) {
  const brand = flattenBrand(activeBrand)
  const listing_url = brand && brand.messages ? brand.messages.listing_url : ''

  return listing_url
    ? listing_url.replace('%1', listing.mls_number)
    : `${config.app.url}/dashboard/mls/${listing.id}`
}

export function getColor(activeBrand: IBrand, color: string) {
  const brand = flattenBrand(activeBrand)

  if (brand && brand.palette && brand.palette.marketing) {
    return lodashGet(brand.palette.marketing, color, '')
  }

  return ''
}
