import Fetch from '../../../services/fetch'

export interface CreateTemplateOptions {
  name: string
  variant: string
  templateType: IMarketingTemplateType
  medium: string
  html: string
  brands: UUID[]
  originalTemplateId?: UUID
  mjml?: boolean
  inputs?: string[]
}

export async function createTemplate({
  name,
  variant,
  templateType,
  medium,
  html,
  brands,
  originalTemplateId,
  mjml = false,
  inputs = []
}: CreateTemplateOptions): Promise<ApiResponseBody<IMarketingTemplate>> {
  try {
    const response = await new Fetch().post('/templates').send({
      name,
      variant,
      template_type: templateType,
      medium,
      html,
      brands,
      origin: originalTemplateId,
      mjml,
      inputs
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}
