import { getTemplateInstance } from '@app/models/instant-marketing/triggers/helpers/get-template-instance'
import { renderBrandedNunjucksTemplate } from '@app/utils/marketing-center/render-branded-nunjucks-template'

/**
 * create a template instance
 * @param {IBrandMarketingTemplate} template - brand template
 * @param {IBrand} brand - brand object
 * @param {IUser} user - user object
 */

export const createTemplateInstance = async (
  template: IBrandMarketingTemplate,
  brand: Nullable<IBrand>,
  user: IUser
): Promise<IMarketingTemplateInstance | void> => {
  try {
    if (!brand) {
      throw new Error('brand is not available.')
    }

    // render the nunjuks template
    const templateMarkup: string = await renderBrandedNunjucksTemplate(
      template,
      brand,
      { user }
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
