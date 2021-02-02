import { createTemplateInstance } from '../../create-template-instance'

export const getTemplateInstance = async (
  templateId: UUID,
  templateMarkup: string
): Promise<IMarketingTemplateInstance> => {
  try {
    // create a template instance
    const instance: IMarketingTemplateInstance = await createTemplateInstance(
      templateId,
      {
        html: templateMarkup
      }
    )

    return instance
  } catch (e) {
    throw e
  }
}
