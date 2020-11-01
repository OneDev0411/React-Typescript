import { loadTemplateHtml } from "models/instant-marketing"

import { getTemplateRenderData } from "components/InstantMarketing/Builder/utils/get-template-render-data"
import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { renderMjml } from "components/TemplatePreview/helpers"

interface TemplateData {
  contact?: IContact
  listing?: IListing
  listings?: IListing[]
}

export const renderBrandedNunjuksTemplate = async (template: IBrandMarketingTemplate, brand: IBrand, data: TemplateData = {}): Promise<string> => {
  const renderData = getTemplateRenderData(brand)

  const markup = await loadTemplateHtml(template)

  const renderedTemplate = nunjucks.renderString(markup, {
    ...renderData,
    ...data
  })

  return renderedTemplate
}
