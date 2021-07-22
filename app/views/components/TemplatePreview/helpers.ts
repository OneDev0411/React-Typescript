import _get from 'lodash/get'
import superagent from 'superagent'

import { TemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'

interface Response {
  html: string
  errors: any
}

export async function renderMjml(mjml: string): Promise<Response> {
  const response = await superagent
    .post('/api/utils/render-mjml')
    .send({ mjml })

  return response.body
}

export function getTemplatePreviewRenderData(
  palette: BrandMarketingPalette
): TemplateRenderData {
  return {
    getListingUrl: () => '',
    get: (key: BrandMarketingPaletteKey) => _get(palette, key)
  }
}
