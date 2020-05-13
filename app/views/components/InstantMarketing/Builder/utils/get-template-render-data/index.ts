import {
  getMjmlBrandStyles,
  getNonMjmlBrandStyles
} from 'utils/marketing-center/templates'

import { getListingUrl, get } from '../../../helpers/nunjucks-functions'

interface CommonTemplateRenderData {
  getListingUrl: (listing: IListing) => string
  get: (name: BrandSettingsPaletteKey) => string
}

export interface TemplateRenderData extends CommonTemplateRenderData {
  palette: string
}

function getCommonTemplateRenderData(brand: IBrand): CommonTemplateRenderData {
  return {
    getListingUrl: getListingUrl.bind(null, brand),
    get: get.bind(null, brand)
  }
}

export function getMjmlTemplateRenderData(brand: IBrand): TemplateRenderData {
  const palette = getMjmlBrandStyles(brand, get.bind(null, brand))

  return {
    palette,
    ...getCommonTemplateRenderData(brand)
  }
}

export function getNonMjmlTemplateRenderData(
  brand: IBrand
): TemplateRenderData {
  const palette = getNonMjmlBrandStyles(brand, get.bind(null, brand))

  return {
    palette,
    ...getCommonTemplateRenderData(brand)
  }
}
