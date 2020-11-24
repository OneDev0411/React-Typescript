import {
  renderBrandedNunjucksTemplate,
  TemplateData
} from 'utils/marketing-center/render-branded-nunjucks-template'

import { createTemplateInstance } from '../../create-template-instance'

export const getTemplateInstance = async (
  template: IBrandMarketingTemplate,
  brand: IBrand,
  data: TemplateData
): Promise<IMarketingTemplateInstance> => {
  try {
    // render the nunjucks template
    const html: string = await renderBrandedNunjucksTemplate(
      template,
      brand,
      data
    )

    // create a template instance
    const instance: IMarketingTemplateInstance = await createTemplateInstance(
      template.template.id,
      {
        html
      }
    )

    return instance
  } catch (e) {
    throw e
  }
}
