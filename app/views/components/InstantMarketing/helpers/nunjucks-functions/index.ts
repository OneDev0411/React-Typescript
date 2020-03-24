import lodashGet from 'lodash/get'

import flattenBrand from 'utils/flatten-brand'

import config from '../../../../../../config/public'

export function getListingUrl(activeBrand: IBrand, listing: IListing) {
  const brand = flattenBrand(activeBrand)
  const listing_url = brand && brand.messages ? brand.messages.listing_url : ''

  return listing_url
    ? listing_url.replace('%1', listing.mls_number)
    : `${config.app.url}/dashboard/mls/${listing.id}`
}

const DEFAULT_PALETTE = {
  'body-bg-color': '#f3f3f3',
  'body-text-color': '#7f7f7f',
  'body-font-family': 'Barlow',
  'body-font-weight': 'normal',
  'body-font-size': '14px',
  'container-bg-color': '#fff',
  'container-text-color': '#000',
  'container-font-family': 'Barlow',
  'container-font-weight': 'normal',
  'container-font-size': '17px',
  'button-text-color': '#000',
  'button-bg-color': 'white',
  'button-border': '2px solid #000',
  'button-font-family': 'Ubuntu',
  'button-font-weight': 'normal',
  'button-font-size': '14px',
  'light-font-family': 'Barlow',
  'light-font-weight': 'normal',
  'light-text-color': '#808080',
  'light-font-size': '17px',
  'h1-font-family': 'Barlow',
  'h1-font-weight': 'bold',
  'h1-text-color': '#000',
  'h1-font-size': '48px',
  'h2-font-weight': 'bold',
  'h2-text-color': '#000',
  'h2-font-size': '30px',
  'h2-font-family': 'Barlow',
  'h3-font-weight': 'bold',
  'h3-text-color': '#000',
  'h3-font-size': '23px',
  'h3-font-family': 'Barlow',
  'inverted-container-bg-color': '#000',
  'inverted-container-text-color': '#fff',
  'inverted-button-bg-color': '#000',
  'inverted-button-text-color': '#fff',
  'inverted-button-light-color': '#b4b4b4',
  'inverted-button-h1-color': '#fff',
  'inverted-button-h2-color': '#fff',
  'inverted-button-h3-color': '#fff'
}

export function get(activeBrand: IBrand, name: string): string {
  const brand = flattenBrand(activeBrand)

  const defaultValue = lodashGet(DEFAULT_PALETTE, name)

  return lodashGet(brand, `settings.palette.palette.${name}`, defaultValue)
}
