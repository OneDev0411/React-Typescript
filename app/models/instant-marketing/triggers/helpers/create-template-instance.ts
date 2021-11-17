import {
  renderBrandedNunjucksTemplate,
  TemplateData
} from '@app/utils/marketing-center/render-branded-nunjucks-template'

import { getTemplateInstance } from './get-template-instance'

/**
 * create a template instance
 * @param {IBrandMarketingTemplate} template - brand template
 * @param {IBrand} brand - brand object
 * @param {TemplateData} templateData - data for render a template
 */

export const createTemplateInstance = async (
  template: IBrandMarketingTemplate,
  brand: Nullable<IBrand>,
  templateData: TemplateData = {}
): Promise<IMarketingTemplateInstance | void> => {
  try {
    if (!brand) {
      throw new Error('brand is not available.')
    }

    // render the nunjuks template
    const templateMarkup: string = await renderBrandedNunjucksTemplate(
      template,
      brand,
      templateData
    )

    const instance = await getTemplateInstance(
      template.template.id,
      templateMarkup
    )

    return instance
  } catch (error) {
    console.error(error)
  }
}
