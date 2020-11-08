import superagent from 'superagent'
import _get from 'lodash/get'

import config from 'config'

import { TemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'

interface Response {
  html: string
  errors: any
}

export async function renderMjml(mjml: string): Promise<Response> {
  const response = await superagent
    .post(`${config.proxy.url}/api/utils/render-mjml`)
    .send({ mjml })

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
