import {
  renderBrandedNunjuksTemplate,
  TemplateData
} from 'utils/marketing-center/render-branded-nunjuks-template'

import { createTemplateInstance } from '../../create-template-instance'

export const getTemplateInstance = async (
  template: IBrandMarketingTemplate,
  brand: IBrand,
  data: TemplateData
): Promise<IMarketingTemplateInstance> => {
  try {
    // render the template to the nunjuks
    const html: string = await renderBrandedNunjuksTemplate(
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
