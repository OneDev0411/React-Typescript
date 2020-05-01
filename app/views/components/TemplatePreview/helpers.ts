import superagent from 'superagent'
import _get from 'lodash/get'
import nunjucks from 'nunjucks'

import { BRAND_STYLES_TEMPLATE_MJML } from 'utils/marketing-center/templates'
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

export function getPaletteStyles(palette: BrandSettingsPalette): string {
  const get = (key: BrandSettingsPaletteKey) => _get(palette, key)

  return nunjucks.renderString(BRAND_STYLES_TEMPLATE_MJML, { get })
}

export function getTemplatePreviewRenderData(
  palette: BrandSettingsPalette
): TemplateRenderData {
  const paletteStyles = getPaletteStyles(palette)

  return {
    palette: paletteStyles,
    getListingUrl: () => '',
    get: (key: BrandSettingsPaletteKey) => _get(palette, key)
  }
}
