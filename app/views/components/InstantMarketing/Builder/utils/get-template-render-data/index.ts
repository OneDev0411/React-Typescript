import { getListingUrl, get } from '../../../helpers/nunjucks-functions'

export type TemplateRenderData<TCustomRenderData = {}> = {
  getListingUrl: (listing: IListing) => string
  get: (name: BrandMarketingPaletteKey) => string
} & TCustomRenderData

export function getTemplateRenderData(brand: IBrand): TemplateRenderData {
  return {
    getListingUrl: getListingUrl.bind(null, brand),
    get: get.bind(null, brand)
  }
}
