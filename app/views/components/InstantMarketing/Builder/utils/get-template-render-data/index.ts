import { getBrandStyles } from 'utils/marketing-center/templates'

import { getListingUrl, get } from '../../../helpers/nunjucks-functions'

export interface TemplateRenderData {
  palette: string
  getListingUrl: (listing: IListing) => string
  get: (name: string) => string
}

export default function getTemplateRenderData(
  brand: IBrand
): TemplateRenderData {
  const palette = getBrandStyles(brand, get.bind(null, brand))

  return {
    palette,
    getListingUrl: getListingUrl.bind(null, brand),
    get: get.bind(null, brand)
  }
}
