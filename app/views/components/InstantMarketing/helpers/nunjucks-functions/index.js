import flattenBrand from 'utils/flatten-brand'

export const getAsset = (brand, name) =>
  flattenBrand(brand).assets.marketing[name] || ''

export function getListingUrl(brand, listing) {
  const brandData = flattenBrand(brand)
  const { listing_url } = brandData.message

  return listing_url
    ? listing_url.replace('%1', listing.mls_number)
    : `https://rechat.com/dashboard/mls/${listing.mls_number}`
}
