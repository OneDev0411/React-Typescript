import superagent from 'superagent'
import _get from 'lodash/get'

import { TemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'

const RENDER_MJML_API_URL = '/api/utils/render-mjml'

interface Response {
  html: string
  errors: any
}

export async function renderMjml(mjml: string): Promise<Response> {
  const response = await superagent.post(RENDER_MJML_API_URL).send({ mjml })

  return response.body
}

export function getTemplatePreviewRenderData(
  palette: BrandSettingsPalette
): TemplateRenderData {
  return {
    getListingUrl: () => '',
    get: (key: BrandSettingsPaletteKey) => _get(palette, key)
  }
}
