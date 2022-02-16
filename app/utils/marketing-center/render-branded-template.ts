import { IImpersonateUser } from '@app/reducers/user/impersonate-user'
import { getTemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'
import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { renderMjml } from 'components/TemplatePreview/helpers'
import { loadTemplateHtml } from 'models/instant-marketing'

export interface TemplateData {
  user?: IUser | IImpersonateUser
  contact?: IContact
  listing?: IListing
  listings?: IListing[]
  crmopenhouse?: {
    title: string
    due_date: string
  }
}

export default async function renderBrandedTemplate(
  template: IBrandMarketingTemplate,
  brand: IBrand,
  data: TemplateData
): Promise<string> {
  const renderData = getTemplateRenderData(brand)

  const markup = await loadTemplateHtml(template)

  const nunjucksRenderedTemplate = nunjucks.renderString(markup, {
    ...renderData,
    ...data
  })

  if (!template.template.mjml) {
    return nunjucksRenderedTemplate
  }

  const response = await renderMjml(nunjucksRenderedTemplate)

  return response.html
}
