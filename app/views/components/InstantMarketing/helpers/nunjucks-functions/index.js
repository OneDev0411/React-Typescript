import _ from 'lodash'

export const getAsset = (brand, name) => _.get(brand.assets.marketing, name)
