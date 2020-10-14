import Fetch from '../../../services/fetch'

interface SaveTemplateArguments {
  name: string
  variant: string
  templateType: IMarketingTemplateType
  medium: string
  html: string
  brands: UUID[]
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
  mjml = false,
  inputs = []
}: SaveTemplateArguments): Promise<ApiResponseBody<IMarketingTemplate>> {
  try {
    const response = await new Fetch().post('/templates').send({
      name,
      variant,
      template_type: templateType,
      medium,
      html,
      brands,
      mjml,
      inputs
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}
