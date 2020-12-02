import { createTemplateInstance } from '../../create-template-instance'
import { TriggerTemplateInput } from '../types'

export const getTemplateInstance = async (
  template: TriggerTemplateInput
): Promise<IMarketingTemplateInstance> => {
  try {
    // create a template instance
    const instance: IMarketingTemplateInstance = await createTemplateInstance(
      template.id,
      {
        html: template.markup
      }
    )

    return instance
  } catch (e) {
    throw e
  }
}
