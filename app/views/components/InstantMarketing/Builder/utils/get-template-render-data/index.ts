import { getListingUrl, get } from '../../../helpers/nunjucks-functions'

export interface TemplateRenderData {
  getListingUrl: (listing: IListing) => string
  get: (name: BrandMarketingPaletteKey) => string
}

export function getTemplateRenderData(brand: IBrand): TemplateRenderData {
  return {
    getListingUrl: getListingUrl.bind(null, brand),
    get: get.bind(null, brand)
  }
}
