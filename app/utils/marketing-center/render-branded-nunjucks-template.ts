import { loadTemplateHtml } from "models/instant-marketing"

import { getTemplateRenderData } from "components/InstantMarketing/Builder/utils/get-template-render-data"
import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

export interface TemplateData {
  contact?: IContact
  user?: IUser
  listing?: IListing
  listings?: IListing[]
}

export const renderBrandedNunjucksTemplate = async (template: IBrandMarketingTemplate, brand: IBrand, data: TemplateData = {}): Promise<string> => {
  const renderData = getTemplateRenderData(brand)

  const markup = await loadTemplateHtml(template)

  const renderedTemplate = nunjucks.renderString(markup, {
    ...renderData,
    ...data
  })

  return renderedTemplate
}
