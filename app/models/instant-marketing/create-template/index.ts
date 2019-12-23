import Fetch from '../../../services/fetch'

interface SaveTemplateArguments {
  name: string
  variant: string
  templateType: string
  medium: string
  html: string
  brands: UUID[]
  inputs?: string[]
}

export async function createTemplate({
  name,
  variant,
  templateType,
  medium,
  html,
  brands,
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
      inputs
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}
