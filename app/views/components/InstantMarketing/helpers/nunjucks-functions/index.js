import flattenBrand from 'utils/flatten-brand'

export const getAsset = (brand, name) =>
  flattenBrand(brand).assets.marketing[name] || ''
