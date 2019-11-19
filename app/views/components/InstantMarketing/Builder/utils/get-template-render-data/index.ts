import { getBrandStyles } from 'utils/marketing-center/templates'

import {
  getAsset,
  getListingUrl,
  getColor
} from '../../../helpers/nunjucks-functions'

export interface TemplateRenderData {
  palette: string
  getAsset: (assetName: string) => string
  getListingUrl: (listing: IListing) => string
  getColor: (color: string) => string
}

export default function getTemplateRenderData(
  brand: IUserTeam
): TemplateRenderData {
  const palette = getBrandStyles(brand)

  return {
    palette,
    getAsset: getAsset.bind(null, brand),
    getListingUrl: getListingUrl.bind(null, brand),
    getColor: getColor.bind(null, brand)
  }
}
